import { PrismaClient } from '@prisma/client'

function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === 'function';
}

interface History {
  status: string
  saved: string | boolean
  pageStatus: boolean
  timestamp?: string | Date
}

async function main() {

  const prisma = new PrismaClient()

  const histories = await prisma.crawl_log.findMany({
    select: {
      id: true,
      history: true,
      article_id: true,
    },
  })

  // Get most recent timestamp
  for (const row of histories) {
    const history = row?.history || isIterable(row?.history) ? row!.history : []
    const savedAt = recentSavedTime(history as any[])
    console.assert(savedAt, "잘 안 나옴 ㅠ", row)
    const cralwed = await prisma.crawl_log.update({
      where: { id: row.id },
      data: {
        saved_at: savedAt
      }
    })
  }

  await prisma.$disconnect()
}

function recentSavedTime(history: any[]) {
  const timestamps: string[] = history.map(value => {
    if ('timestamp' in value) {
      return value.timestamp
    }
  }).filter(e => e)

  const sortedTime = timestamps.sort((a: string, b: string) => {
    const dateA = new Date(a)
    const dateB = new Date(b)
    return dateA < dateB ? 1 : -1
  })

  return sortedTime[0]
}

main()