import { Context } from "koa";

export function greet(ctx: Context) {
  console.log("hello - chrome_extension helper")
  ctx.body = {
    status: "success",
    data: "hello - chrome_extension helper"
  }
}