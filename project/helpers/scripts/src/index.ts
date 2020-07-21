import { analyzeExtractionLog, getDateFallback } from './recent-log'
import { writeFileSync } from 'fs'
import { fail } from 'assert'

async function main() {
  console.log("START Script")
  const result = await analyzeExtractionLog()
  if (result)
    writeResult(result)
  const [passed, failed] = countRecent(result!)
  writeResult(failed, "failed.txt")
}

function countRecent(logs: any[]) {
  console.log(logs.length)
  let passed: any[] = []
  let failed: any[] = []
  logs.forEach(row => {
    const baseDate = new Date("2020-07-10T06:00")
    const date = getDateFallback(row[1].timestamp)
    if (baseDate.valueOf() < date.valueOf()) passed.push(row);
    else failed.push(row[0]);
  })
  console.log(passed.length)
  console.log(failed.length)
  return [passed, failed]
}

function writeResult(result: any[], filename = "result.txt") {
  writeFileSync(filename, JSON.stringify(result))
}

main()