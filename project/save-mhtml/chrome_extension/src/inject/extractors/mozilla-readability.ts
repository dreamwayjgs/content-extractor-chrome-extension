import Extractor, { ExtractorResult } from './extractor'
import { Readability, isProbablyReaderable } from "@mozilla/readability"
import $ from 'jquery'


class MozReadabilityExtractor implements Extractor {
  name = "moz-readability"
  extractedElement = document.body
  report: ExtractorResult = {
    extractorName: this.name,
    title: "No Title",
    result: "",
    raw: {}
  }
  constructor() { }
  extract() {
    const documentClone = document.cloneNode(true)
    const article = new Readability(documentClone).parse()
    console.dir(article)
    const extracted = article.content
    const hyu = $(extracted).children().first().attr('hyu')
    console.assert(hyu, "Not Tagged. Save again")
    console.log("IS REDABLE", isProbablyReaderable(document))
    const answer = $(`[hyu='${hyu}']`)

    this.extractedElement = answer[0] ? answer[0] : document.body
    this.report = {
      extractorName: this.name,
      title: article.title,
      result: this.extractedElement.outerHTML,
      raw: {
        article: article,
        readable: isProbablyReaderable(document),
        answer: answer
      }
    }
    return this.report
  }
}


export default MozReadabilityExtractor