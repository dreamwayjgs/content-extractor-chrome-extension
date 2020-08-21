import { analyzeExtractionLog, getDateFallback } from './recent-log'
import { writeFileSync } from 'fs'

async function main() {
  console.log("START Script")
  const [result, missed] = await analyzeExtractionLog()
  if (result)
    writeResult(result)
  const [passed, failed] = countRecent(result!)
  console.log("passed ", passed.length)
  console.log("failed ", failed.length)
  const [normal, forced] = countForcedCrawl(passed!)
  // writeResult(failed, "failed.txt")
  // writeResult(missed.map((e: [any, any]) => {
  //   console.log(typeof (e[0]))
  //   return parseInt(e[0])
  // }
  // ), "missed-pg.txt")
  // writeResult(missed.map((e: [any, any]) => e[0]), "missed.txt")
}

function countForcedCrawl(logs: any[]) {
  let normal: any[] = []
  let forced: any[] = []
  logs.forEach(row => {
    if (row[1].pageStatus) normal.push(row);
    else forced.push(row);
  })
  console.log(normal.length)
  console.log(forced.length)
  return [normal, forced]
}

function countRecent(logs: any[]) {
  console.log("full logs", logs.length)
  let passed: any[] = []
  let failed: any[] = []
  logs.forEach(row => {
    const baseDate = new Date("2020-07-10T06:00")
    const date = getDateFallback(row[1].timestamp)
    if (baseDate.valueOf() < date.valueOf()) passed.push(row);
    else {
      console.log(row)
      failed.push(row[0]);
    }
  })
  console.log(passed.length)
  console.log(failed.length)
  return [passed, failed]
}

function writeResult(result: any[], filename = "result.txt") {
  writeFileSync(filename, JSON.stringify(result))
}

main()