import { Client } from 'pg'
import { getPgClient } from '../helpers/connect-pg'
import { Context } from 'koa'

class QueryBoard {
  private static instance: QueryBoard
  client: Client
  private constructor() {
    this.client = getPgClient()
  }
  static getInstance() {
    if (!QueryBoard.instance) {
      QueryBoard.instance = new QueryBoard()
    }
    QueryBoard.instance.connect()
    return QueryBoard.instance
  }
  async connect() {
    try { await this.client.connect() }
    catch (e) {

    }
  }
  async excuteQuery(query: string, value?: any[]): Promise<any[]> {
    try {
      const res = await this.client.query(query, value)
      return res.rows
    }
    catch (err) {
      console.log("Query Failed", err.stack)
      return []
    }
  }
}


export async function getQueryBoardAction(ctx: Context) {
  console.log(ctx.request.query)
  const query = ctx.request.query.query
  console.log(typeof (query), query)

  const queryBoard = QueryBoard.getInstance()
  const rows = await queryBoard.excuteQuery(query)

  const started = Date.parse("2020-07-10T01:25:32.935Z")

  const timestamps = rows.map(row => {
    const col = row.extraction_log
    if (col.length) {
      const found = col.find((element: any) => {
        const ts = Date.parse(element.timestamp)
        return ts > started
      })
      if (found) return row.id;
    }
    if (col.timestamp && Date.parse(col.timestamp) > started) {
      return row.id
    }
  })
  console.log("----timestamps----")
  console.log(timestamps)

  const ids = timestamps.filter(e => e)
  const body = await queryBoard.excuteQuery("SELECT id, url_origin FROM target_page WHERE not (id = ANY ($1))", [ids])
  console.log(body.length)
  ctx.body = body
}

export default QueryBoard