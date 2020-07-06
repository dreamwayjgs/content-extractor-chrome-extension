import { getPgClient } from '../helpers/connect-pg'
import { Context } from 'koa'


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
      console.log(sql)
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

export async function getFailedArticlesAction(ctx: Context) {
  const from = (ctx.request.query.from !== undefined) ? parseInt(ctx.request.query.from) : -1
  const size = (ctx.request.query.size !== undefined) ? parseInt(ctx.request.query.size) : -1

  const client = getPgClient()
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

export async function postArticleAction(ctx: Context) {
  const body = ctx.request.body
  const client = getPgClient()
  try {
    await client.connect()
  } catch (err) {
    errorMsg(ctx, err, "Connection refused. Try again")
  }
  try {
    const log = JSON.parse(body.log)
    let sql = "UPDATE target_page SET extraction_log = $1, saved = $2"
    let values = [log, log.saved]
    if (ctx.request.files && ctx.request.files.mhtml) {
      sql += ", mhtml = $3"
      values.push(ctx.request.files.mhtml)
    }
    sql += "WHERE id = $4"
    values.push(body.id)
    const res = await client.query(sql, values)
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