import { readFileSync } from 'fs'
import { Pool, Client } from 'pg'


function connectPg(filename = "db.properties", targetDb = "cssc") {
  const dbPropList = JSON.parse(readFileSync(filename, { encoding: "utf8" }))
  const dbProps = dbPropList[targetDb]
  return dbProps
}

export function getPgPool(): Pool {
  const dbProps = connectPg()
  const pool = new Pool({
    host: dbProps.host,
    port: dbProps.port,
    user: dbProps.username,
    password: dbProps.password,
    database: dbProps.database,
  })
  return pool
}


export function getPgClient(): Client {
  const dbProps = connectPg()
  const client = new Client({
    host: dbProps.host,
    port: dbProps.port,
    user: dbProps.username,
    password: dbProps.password,
    database: dbProps.database,
  })
  return client
}