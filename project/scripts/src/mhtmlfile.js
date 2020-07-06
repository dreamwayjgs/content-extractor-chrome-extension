// import * as mhtml2html from 'mhtml2html'
import { readFileSync } from 'fs'
import mhtml2html from 'mhtml2html'
import { JSDOM } from 'jsdom'

export function getHtmlAsString(path) {
  const mhtml = readFileSync(path, { encoding: "utf8" })
  const htmlDoc = mhtml2html.parse(mhtml, { htmlOnly: true, parseDOM: html => html });
  return htmlDoc
}