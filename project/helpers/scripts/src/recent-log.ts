import { getPgClient } from './connect-pg'
import { resourceUsage } from 'process'

interface PageResult {
  id: number
  extraction_log?: any
}

export async function analyzeExtractionLog() {
  const client = getPgClient()
  await client.connect()
  const sql = "SELECT id, extraction_log FROM target_page"
  try {
    const res = await client.query(sql)
    const rows = res.rows
    console.log("Counts: ", rows.length)
    const extracted = rows.map(countJsonLength).filter(e => e)
    client.end().catch(err => { console.log(err, "Error during client disconnection") })
    return extracted
  } catch (e) {
    console.log(e)
  }
}

function countJsonLength(row: PageResult, index: number) {
  const id = row.id
  const log = row.extraction_log
  if (log.length === undefined) {
    return undefined
  }
  else if (log.length === 1) {
    return [id, log.timestamp]
  }
  else {
    return [id, latestTimestamp(log)]
  }
}

function latestTimestamp(logs: any[]) {
  const recent = logs.sort((a, b) => {
    const date1 = getDateFallback(a.timestamp)
    const date2 = getDateFallback(b.timestamp)
    if (date1 > date2) return -1;
    else if (date1 < date2) return 1;
    else return 0;
  })[0]

  return recent
}

export function getDateFallback(a?: string) {
  if (a === undefined) {
    return Date.parse(new Date(0).toISOString())
  }
  return Date.parse(a)
}