import { timestampedLog } from '../modules/debugger'
import WebPage from './webpage'

class Preprocessor {
  webpage: WebPage
  constructor() {
    this.webpage = new WebPage(document)
    timestampedLog("Indexing starts")
    this.webpage.indexing()
    timestampedLog("indexing end", this.webpage)
  }
}

export default Preprocessor