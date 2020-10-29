import { PrismaClient } from '@prisma/client'
import { app } from './app'

export const prisma = new PrismaClient()

async function main() {
  app.listen(53000, "0.0.0.0")
  console.log(new Date().toISOString(), "Koa running on 53000 to all hosts!")
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })