import { timestampedLog } from '../modules/debugger'
import WebPage from './webpage'

class Preprocessor {
  webpage: WebPage
  constructor() {
    this.webpage = new WebPage(document)
  }

  waitToForceRun() {

  }

  runOnNormal() {

  }

  preprocess() {
    timestampedLog("Indexing starts")
    this.webpage.indexing()
    timestampedLog("indexing end", this.webpage)
  }

  async requestSaveMhtml(msg?: string) {
    const message = { command: "save", type: "mhtml", msg: msg }
    const res = await this.sendMessage(message)
  }

  sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (res: any) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        }
        resolve(res)
      })
    })
  }
}

export default Preprocessor