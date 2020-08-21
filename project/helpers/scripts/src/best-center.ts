import { getPgClient } from './connect-pg'


async function getExtractorResult(): Promise<[any[], any[]]> {
  const client = getPgClient()
  try {
    await client.connect()
    const sql = "SELECT id, extractor_report from target_page LIMIT 2"
    const res = await client.query(sql)
    const moz: any[] = []
    const cf: any[] = []
    res.rows.forEach(row => {
      moz.push({
        id: row.id,
        report: row.extractor_report[0]
      })
      cf.push({
        id: row.id,
        report: row.extractor_report[1]
      })
    })
    return [moz, cf]
  }
  catch (err) {
    console.error(err, "Error")
    throw new Error()
  }
  finally {
    client.end().catch(err => { console.error(err, "Error during client disconnection") })
  }
}

async function main() {
  const [moz, cf] = await getExtractorResult()
  console.log(cf[0].report.raw.reportOfCenters[0].elements[0].element)
}

main()