import { Context } from "koa";
import { prisma } from '../index'

export async function getCurationAnswerAction(ctx: Context) {
  const aid: number = parseInt(ctx.request.query.aid)
  console.log("REQUEST Answer", aid)

  const users = [11, 14]

  const answers = await prisma.naver_check_answer.findMany({
    where: {
      article_id: aid,
      uid: {
        in: users
      }
    },
    include: {
      naver_check_user: {
        select: {
          name: true
        }
      }
    }
  })

  ctx.body = answers
}