import { Client, ClientConfig } from 'pg'

const original_col = [
  'id', 'aid_naver', 'title', 'content', 'date', 'url_naver', 'url_origin', 'subcategory_naver', 'category_naver', 'press', 'pdf', 'num_comment'
]

const look_col = [
  'similarity', 'text_count'
]

const config: ClientConfig = {
  user: 'postgres',
  password: "rkskekfk",
  database: "cssc",
  host: "dumpdb.hanyang.ac.kr",
  port: 54321
}

const client = new Client(config)

async function main() {
  try {
    await client.connect()
    const sql = 'SELECT * FROM target_page LIMIT 1'
    const result = await client.query(sql)
    const row = result.rows[0]
    const report = row["extractor_report"]
    console.log(report.length)
    console.log(report[1].length)
    console.log(report[1][2])
    // console.log(report[1][0][1].report)    
    // console.log(report[1][1])
    // console.log(report[1][2])
    // console.log(report[1][3])
    // console.log(Object.keys(report[1][0]))
    // console.log(Object.keys(report[1][1]))
    // console.log(report[0][0].extractorName)
    // console.log(report[0][1].extractorName)
    // for (const [key, value] of Object.entries(result.rows[0])) {
    //   if ((look_col).includes(key)) {
    //     console.log(value)
    //   }
    // }

    await client.end()
  }
  catch (e) {
    console.log(e)
  }
}

main()