import Extractor from './extractor'
import { Readability } from "@mozilla/readability"
import $ from 'jquery'


class MozReadabilityExtractor implements Extractor {
  name = "moz-readability"
  extractedElement = document.body
  constructor() { }
  extract() {
    const documentClone = document.cloneNode(true)
    const article = new Readability(documentClone).parse()
    console.dir(article)
    const extracted = article.content
    const hyu = $(extracted).children().first().attr('hyu')
    console.assert(hyu, "Not Tagged. Save again")
    const answer = $(`[hyu='${hyu}']`)

    this.extractedElement = answer[0] ? answer[0] : document.body

    return {
      extractorName: this.name,
      title: article.title,
      result: this.extractedElement.outerHTML,
      raw: article
    }
  }
}


export default MozReadabilityExtractor