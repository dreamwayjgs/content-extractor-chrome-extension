import { Context } from "koa";

export async function greet(ctx: Context) {
  ctx.body = {
    status: "success",
    data: "hello - chrome_extension helper"
  }
}