import { Context } from "koa";
import { readFileSync, writeFileSync } from 'fs'


export async function postFileAction(ctx: Context) {
  if (ctx.request.files === undefined) return;
  const mhtml = ctx.request.files.mhtml
  const path = mhtml.path

  const file = readFileSync(path)
  console.log(file.toString('utf8'))
  writeFileSync("test.mhtml", file.toString('utf8'))
}