import { getPgClient } from '../helpers/connect-pg'
import { mhtmlHandler } from './FileHandler'
import { errorMsg } from './Core'
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
    let sql = "SELECT id, url_origin FROM target_page where center_values is null order by id"
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
  console.log("File id: ", id)
  const client = getPgClient()
  await client.connect()

  try {
    const sql = "SELECT id, url_origin, extraction_log FROM target_page WHERE id = ($1)"
    const res = await client.query(sql, [id])

    const filename = res.rows[0].id
    const file = mhtmlHandler(filename)
    ctx.set("Content-disposition", `attachment; filename=${id}.mhtml`)
    ctx.statusCode = 200
    ctx.body = file

    await client.end()
    console.log("End Successful")
    console.log("Transferred")
  }
  catch (err) {
    errorMsg(ctx, err, "")
  }
}

export async function getArticleCheckedAnswerAction(ctx: Context) {
  const aid: number = parseInt(ctx.request.query.aid) ?? errorMsg(ctx, "ID must be a number")
  console.log("Requested answer: ", aid)
  const client = getPgClient()
  await client.connect()

  try {
    const sql = `select t_user.name, t_answer.*
    from naver_check_user as t_user, naver_check_answer as t_answer 
    where t_user.uid = t_answer.uid and t_user.uid = any (ARRAY[11, 14]) and t_answer.aid = ($1)`
    const res = await client.query(sql, [aid])
    ctx.body = res.rows
  }
  catch (err) {
    errorMsg(ctx, err, "")
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
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

      const webpage = JSON.parse(body.webpage)
      sql += ", webpage = $4"
      values.push(webpage)

      sql += "WHERE id = $5"
      values.push(body.id)
    }
    else {
      sql += "WHERE id = $3"
      values.push(body.id)
    }

    const res = await client.query(sql, values)
    console.assert(res.rowCount === 1, "UPDATE FAILED")
    await client.query("COMMIT")
    ctx.body = "Received"
  }
  catch (err) {
    await client.query("ROLLBACK")
    errorMsg(ctx, err, "Query Failed")
    if (err instanceof SyntaxError) {
      console.log(body)
    }
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
}

export async function postCenterValuesAction(ctx: Context) {
  const body = ctx.request.body
  const client = getPgClient()
  try {
    await client.connect()
    const id = body.id
    const data = body.data

    console.log(id, data)

    const sql = "UPDATE target_page SET center_values = $2 WHERE id = $1"
    const values = [id, data]
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

export async function postExtractorResultAction(ctx: Context) {
  console.log("ON: extractor result upload")
  const body = ctx.request.body
  const client = getPgClient()
  try {
    await client.connect()
    const id = body.id
    const data = body.result

    console.log(id)
    const extracted = JSON.parse(data)
    console.log(extracted[1])
    console.log(extracted[1][0][0]['report'].length)

    const sql = "UPDATE target_page SET extractor_report = $2 WHERE id = $1"
    const values = [id, data]
    const res = await client.query(sql, values)
    console.assert(res.rowCount === 1, "UPDATE FAILED")
    await client.query("COMMIT")
    ctx.body = "Received"
    console.log("OK")
  }
  catch (err) {
    await client.query("ROLLBACK")
    errorMsg(ctx, err, "Query Failed")
  }
  client.end().catch(err => { errorMsg(ctx, err, "Error during client disconnection") })
}


function getMhtmlFilePath(id: string | number) {
  return `./static/mhtml/${id}.mhtml`
}