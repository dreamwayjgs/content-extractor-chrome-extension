import { Context } from 'koa'

export function errorMsg(ctx: Context, err: any, msg?: string) {
    console.log(msg)
    console.log(err.stack)
    ctx.body = {
        status: "error",
        data: msg
    }
}