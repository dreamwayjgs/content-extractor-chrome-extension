import { Context } from 'koa';
import { errorMsg } from './Core'
import { getPgClient } from '../helpers/connect-pg';

export async function postInvalidAnswerAction(ctx: Context) {
    const body = ctx.request.body
    const aid = parseInt(body.aid)
    const uid = parseInt(body.uid)

    const client = getPgClient()
    try {
        await client.connect()

        const sql = "UPDATE naver_check_answer SET invalid = true WHERE aid = $1 AND uid = $2"
        const res = await client.query(sql, [aid, uid])
        console.assert(res.rowCount === 1, "UPDATE FAILED")
        await client.query("COMMIT")
        ctx.body = "OK"

        await client.end()
    }
    catch (err) {
        await client.query("ROLLBACK")
        errorMsg(ctx, err, "Query Failed")
    }
}