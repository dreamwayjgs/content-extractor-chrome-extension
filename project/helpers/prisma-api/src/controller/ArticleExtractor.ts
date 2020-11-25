import { Context } from 'koa';
import { prisma } from '../index'

export async function postExtractorResultAction(ctx: Context) {
  const body = ctx.request.body
  const { id, result } = body

  console.log(id)
  console.log(result)
}