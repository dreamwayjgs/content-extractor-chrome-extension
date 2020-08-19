import Extractor from './extractor'
import { Readability } from "@mozilla/readability"
import $ from 'jquery'


class MozReadabilityExtractor implements Extractor {
  name = "moz-readability"
  constructor() { }
  extract() {
    const documentClone = document.cloneNode(true)
    const article = new Readability(documentClone).parse()
    console.dir(article)
    const extracted = article.content
    const hyu = $(extracted).children().first().attr('hyu')
    console.assert(hyu, "Not Tagged. Save again")
    const answer = $(`[hyu='${hyu}']`)
    return {
      title: article.title,
      result: answer[0]
    }
  }
}


export default MozReadabilityExtractor