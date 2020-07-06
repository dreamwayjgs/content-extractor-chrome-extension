import { timestampedLog } from '../modules/debugger'
import { getArticlesUrl, postArticle } from './server'
import Article from '../entities/Article'

class Crawler {
  articles: Article[]
  currentIndex: number = 0
  onLoadListener: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void

  constructor(articles: Article[]) {
    this.articles = articles
    this.onLoadListener = this.saveOnLoad.bind(this)
  }
  static async createWithUrlsFromServer() {
    const urls = await getArticlesUrl("/failed")
    timestampedLog(urls)
    return new Crawler(urls)
  }
  crawl(tabId: number) {
    timestampedLog("Crawl starts...")

    chrome.webNavigation.onCompleted.addListener(this.onLoadListener)
    this.loadPage(tabId)
  }

  saveOnLoad(details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
    const frameId = details.frameId
    if (frameId !== 0) return;

    setTimeout(() => {
      const tabId = details.tabId
      const articleId = this.articles[this.currentIndex].id
      chrome.tabs.sendMessage(tabId, { command: "crawl" }, async res => {
        const lastError = chrome.runtime.lastError
        if (lastError) {
          timestampedLog("error occured")
          return
        }

        try {
          timestampedLog("Saving pages...", articleId, details.url)
          const page = await chrome.pageCapture.saveAsMHTML({ tabId: tabId })
          postArticle(articleId, { status: "Success", saved: true }, page)
        } catch (e) {
          timestampedLog("Saving Failed")
          postArticle(articleId, { status: "Failed", saved: false })
        }
        this.currentIndex++
        this.loadPage(tabId)
      })
    }, 5000)
  }

  loadPage(tabId: number) {
    const index = this.currentIndex
    if (index >= this.articles.length) {
      this.finish(tabId)
      return
    }

    const url = this.articles[index].url_origin
    timestampedLog("Open page", url)
    chrome.tabs.update(tabId, { url: url })
  }

  finish(tabId: number) {
    timestampedLog("Jobs done!", this)
    chrome.webNavigation.onCompleted.removeListener(this.onLoadListener)
  }

  throwError(msg: string): never {
    throw new Error(msg)
  }
}

export default Crawler