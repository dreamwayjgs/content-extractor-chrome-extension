import { Context } from 'koa';
import { prisma } from '../index'

export async function getArticleAction(ctx: Context) {
  const idArray = ctx.request.query.id
  const ids = typeof (idArray) === 'string' ? [parseInt(idArray)] : idArray.map((id: string) => parseInt(id))

  const articles = await prisma.article.findMany({
    where: {
      id: {
        in: ids
      }
    },
    select: {
      id: true,
      url: true,
      crawl_log: {
        select: {
          history: true,
          saved_at: true,
        },
        orderBy: {
          saved_at: 'desc'
        }
      }
    },
    orderBy: { id: 'asc' }
  })
  console.log("IDs", articles)
  ctx.body = articles
}

export async function getArticlesAction(ctx: Context) {
  const from = (ctx.request.query.from !== undefined) ? parseInt(ctx.request.query.from) : -1
  const size = (ctx.request.query.size !== undefined) ? parseInt(ctx.request.query.size) : -1

  let query: any = {
    select: {
      id: true,
      url: true,
      crawl_log: {
        select: {
          history: true,
          saved_at: true,
        },
        orderBy: {
          saved_at: 'desc'
        }
      }
    },
    orderBy: { id: 'asc' }
  }

  if (from !== -1) {
    query['skip'] = from
    query['take'] = size
  }
  const articles = await prisma.article.findMany(query)
  ctx.body = articles
}