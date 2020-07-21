// import mhtml2html from "mhtml2html";
import { getHtmlAsString } from './mhtmlfile'
import { writeFileSync, readdirSync } from 'fs'

async function main() {
  const directory = "../tmp"
  const files = readFileList(directory)
  const file = files[0]
  const filename = file.split('.').slice(0, -1).join('.')

  const html: string = getHtmlAsString(`${directory}/${file}`)
  writeFileSync(`static/${filename}.html`, html, { encoding: "utf8" })
}

function readFileList(directory: string) {
  const files = readdirSync(directory, { encoding: "utf8" })
  return files
}

main()