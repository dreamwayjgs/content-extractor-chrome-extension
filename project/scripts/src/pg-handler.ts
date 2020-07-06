import { getPgClient } from './connect-pg'
import { readFileSync, renameSync } from 'fs'


interface MhtmlInfo {
  id: string
  path: string
}

export async function handlingPg() {
  const mhtmls = await getMhtmls()
  const mhtmlPaths = mhtmls.map(getPathFromMhtml)

  mhtmlPaths.map(convertHtml)
}

function convertHtml(mhtml: MhtmlInfo) {
  const oldPath = ".." + mhtml.path
  const newPath = `../tmp/${mhtml.id}.mhtml`

  try {
    renameSync(oldPath, newPath)
  } catch (e) {
    console.log("Error in ", mhtml.id, mhtml.path)
  }
}

function getPathFromMhtml(mhtml: any, index: number) {
  return {
    id: mhtml.id,
    path: JSON.parse(mhtml.mhtml.toString('utf8')).path
  }
}


async function getMhtmls(): Promise<any[]> {
  const client = getPgClient()
  await client.connect()
  try {
    const res = await client.query("SELECT id, mhtml FROM target_page where mhtml IS NOT NULL")
    const mhtml = res.rows
    await client.end()
    return mhtml
  } catch (e) {
    console.log("Query Failed")
    return []
  }
}