import { Context } from "koa";

export function greet(ctx: Context) {
  ctx.body = {
    status: "success",
    data: "hello - chrome_extension helper"
  }
}