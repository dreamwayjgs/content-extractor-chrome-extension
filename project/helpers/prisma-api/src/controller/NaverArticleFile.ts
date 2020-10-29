import { Context } from 'koa';
import { prisma } from '../index'
import { createMhtmlFile, mhtmlHandler } from '../helper/FileHandler';


export async function postArticleAction(ctx: Context) {
  const body = ctx.request.body
  const files = ctx.request.files

  console.log(Object.keys(body))

  const { article_id, history, stored, node, saved_at } = body
  const filename = `${article_id}_${saved_at}`

  console.log(typeof JSON.parse(history), JSON.parse(history))

  const crawlLog = await prisma.crawl_log.create({
    data: {
      history: JSON.parse(history),
      stored: (stored === 'true'),
      node: JSON.parse(node),
      saved_at: new Date(saved_at),
      filename: filename,
      article: {
        connect: {
          id: parseInt(article_id)
        }
      }
    }
  })
  console.log(crawlLog)

  if (files && files.mhtml) {
    console.log(files.mhtml.path)
    createMhtmlFile(files.mhtml.path, filename)
  }
  ctx.body = "Article POSTED"
}

export async function getArticleMHtmlAction(ctx: Context) {
  const id: number = parseInt(ctx.request.query.id)
  console.log("MHTML Requested. Article id: ", id)
  const rows = await prisma.crawl_log.findFirst({
    where: {
      article_id: id
    },
    orderBy: {
      saved_at: 'desc'
    }
  })
  const filename = rows?.filename
  const file = mhtmlHandler(filename!)
  ctx.set("Content-disposition", `attachment; filename=${id}.mhtml`)
  ctx.statusCode = 200
  ctx.body = file
  console.log("File Transferred")
}
