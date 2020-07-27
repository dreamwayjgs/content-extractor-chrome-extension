import { getPgClient } from '../helpers/connect-pg'
import { Context } from 'koa'
import mv from 'mv'

export async function getArticleAction(ctx: Context) {
  const idArray = ctx.request.query.id
  const ids = typeof (idArray) === 'string' ? [idArray] : idArray.map((id: string) => parseInt(id))

  const client = getPgClient()
  try {
    await client.connect()
  } catch (err) {
    errorMsg(ctx, err, "Connection refused. Try again")
  }
  try {
    const sql = "SELECT id, url_origin FROM target_page WHERE id = ANY ($1)"
    const res = await client.query(sql, [ids])
    ctx.body = res.rows
  }
  catch (err) {
    errorMsg(ctx, err, "Query Failed on Article")
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
}


export async function getArticlesAction(ctx: Context) {
  const from = (ctx.request.query.from !== undefined) ? parseInt(ctx.request.query.from) : -1
  const size = (ctx.request.query.size !== undefined) ? parseInt(ctx.request.query.size) : -1

  const client = getPgClient()
  try {
    await client.connect()
  } catch (err) {
    errorMsg(ctx, err, "Connection refused. Try again")
  }
  try {
    let sql = "SELECT id, url_origin FROM target_page"
    if (from !== -1) {
      sql += " LIMIT $2 OFFSET $1"
      const values = [from, size]
      const res = await client.query(sql, values)
      ctx.body = res.rows
    }
    else {
      const res = await client.query(sql)
      ctx.body = res.rows
    }
  }
  catch (err) {
    errorMsg(ctx, err, "Query Failed All Articles")
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
}

export async function getFailedArticlesAction(ctx: Context) {
  const from = (ctx.request.query.from !== undefined) ? parseInt(ctx.request.query.from) : -1
  const size = (ctx.request.query.size !== undefined) ? parseInt(ctx.request.query.size) : -1

  const client = getPgClient()
  console.log("Restart with failed pages")
  try {
    await client.connect()
  } catch (err) {
    errorMsg(ctx, err, "Connection refused. Try again")
  }
  try {
    let sql = "SELECT id, url_origin FROM target_page where saved = false"
    if (from !== -1) {
      sql += " LIMIT $2 OFFSET $1"
      const values = [from, size]
      const res = await client.query(sql, values)
      ctx.body = res.rows
    }
    else {
      const res = await client.query(sql)
      ctx.body = res.rows
    }
  }
  catch (err) {
    errorMsg(ctx, err, "Query Failed")
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
}

export async function getArticleFileAction(ctx: Context) {  
  const id: number = parseInt(ctx.request.query.id) ?? errorMsg(ctx, "ID must be a number")
  const client = getPgClient()
  await client.connect()
  
  try {
    const sql = "SELECT id, url_origin, extraction_log FROM target_page WHERE id = ($1)"
    const res = await client.query(sql, id)    
  }
  catch(err) {
    errorMsg(ctx, err, "")
  }

}

export async function postArticleAction(ctx: Context) {
  const body = ctx.request.body
  const client = getPgClient()
  try {
    await client.connect()
  } catch (err) {
    errorMsg(ctx, err, "Connection refused. Try again")
  }
  try {
    const logQuery = "SELECT extraction_log FROM target_page WHERE id = $1"
    const logQueryRes = await client.query(logQuery, [body.id])
    const currentLogs = logQueryRes.rows[0].extraction_log
    const newLog = Array.isArray(currentLogs) ? currentLogs : currentLogs !== null ? [currentLogs] : []

    const log = JSON.parse(body.log)
    newLog.push(log)
    let sql = "UPDATE target_page SET extraction_log = $1, saved = $2"
    let values = [JSON.stringify(newLog), log.saved]
    if (ctx.request.files && ctx.request.files.mhtml) {
      const mhtmlPath = ctx.request.files.mhtml.path
      mv(mhtmlPath, getMhtmlFilePath(body.id), () => {
        console.log("File moved!")
      })
      sql += ", mhtml = $3"
      values.push(ctx.request.files.mhtml)
    }
    const webpage = JSON.parse(body.webpage)
    sql += ", webpage = $4"
    values.push(webpage)
    sql += "WHERE id = $5"
    values.push(body.id)
    const res = await client.query(sql, values)
    console.assert(res.rowCount === 1, "UPDATE FAILED")
    await client.query("COMMIT")
    ctx.body = "Received"
  }
  catch (err) {
    await client.query("ROLLBACK")
    errorMsg(ctx, err, "Query Failed")
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
}

function errorMsg(ctx: Context, err: any, msg?: string) {
  console.log(msg)
  console.log(err.stack)
  ctx.body = {
    status: "error",
    data: msg
  }
}

function getMhtmlFilePath(id: string | number) {
  return `./static/mhtml/${id}.mhtml`

}