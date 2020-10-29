import { readFileSync } from 'fs'
import mv from 'mv'

export function mhtmlHandler(filename: string) {
  const filepath = `static/mhtml/${filename}.mhtml`
  const file = readFileSync(filepath)
  return file
}

function getMhtmlFilePath(filename: string | number) {
  return `./static/mhtml/${filename}.mhtml`
}

export function createMhtmlFile(mhtmlPath: string, filename: string) {
  mv(mhtmlPath, getMhtmlFilePath(filename), () => {
    console.log("File moved!")
  })
}