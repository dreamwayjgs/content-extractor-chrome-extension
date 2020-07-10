import { timestampedLog, timestampedAssert } from '../modules/debugger'
import { getArticlesUrl, postArticle, getArticlesById } from './server'
import Article, { ArticlePath } from '../entities/Article'

type PageStatus = "all" | "failed" | "success"
type CrawlStatus = "idle" | "running" | "done"
const MINUTE = 60000
const MAX_TIMEOUT = 1 * MINUTE

class Crawler {
  articles: Article[]
  currentIndex: number = 0
  status: CrawlStatus = "idle"
  timeout?: number
  tabId: number = chrome.tabs.TAB_ID_NONE
  onLoadListener: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void

  constructor(articles: Article[]) {
    this.articles = articles
    this.onLoadListener = this.saveOnLoad.bind(this)
  }
  static async gatherPagesWithStatus(status: PageStatus, from?: number, size?: number) {
    let filter: ArticlePath = ""
    if (status === "failed") filter = "/failed";
    const articles = await getArticlesUrl(filter, from, size)
    timestampedLog(articles)
    return new Crawler(articles)
  }
  static async pickPagesWithId(ids: string[]) {
    const articles = await getArticlesById(ids)
    timestampedLog(articles)
    return new Crawler(articles)
  }
  crawl(tabId: number) {
    timestampedLog("Crawl starts...")
    this.tabId = tabId

    chrome.webNavigation.onCompleted.addListener(this.onLoadListener)
    this.loadPage()
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

        timestampedLog("Receiving end of preprocessing")
        timestampedAssert(res.status, "page not completely loaded. force indexing")
        const numOfFrames = (await chrome.webNavigation.getAllFrames({ tabId: tabId }))?.length

        try {
          timestampedLog("Saving pages...", articleId, details.url)
          const page = await chrome.pageCapture.saveAsMHTML({ tabId: tabId })
          postArticle(articleId, {
            timestamp: new Date().toISOString(),
            status: "Success",
            saved: true,
            pageStatus: res.status,
            numOfFrames: numOfFrames
          }, page, res.webpage)
        } catch (e) {
          timestampedLog("Saving Failed")
          postArticle(articleId, {
            timestamp: new Date().toISOString(),
            status: "Failed",
            saved: false,
            pageStatus: res.status,
            numOfFrames: numOfFrames
          })
        }
        this.clearTimeoutHandler()
        this.currentIndex++
        this.loadPage()
      })
    }, 5000)
  }

  loadPage() {
    const tabId = this.tabId
    const index = this.currentIndex
    if (index >= this.articles.length) {
      this.finish(tabId)
      return
    }

    const url = this.articles[index].url_origin
    timestampedLog("Open page", url)
    chrome.tabs.update(tabId, { url: url }, tab => {
      timestampedLog("Tab updated, start timeout")
      this.timeoutHandler()
    })
  }

  timeoutHandler() {
    const articleId = this.articles[this.currentIndex].id
    this.timeout = setTimeout(() => {
      timestampedLog("%cExpired! Load next page", "color:red;font-size:4rem;")
      postArticle(articleId, {
        timestamp: new Date().toISOString(),
        status: "Failed",
        saved: false,
        pageStatus: "Expired"
      })
      this.currentIndex++
      this.loadPage()
    }, MAX_TIMEOUT)
    timestampedLog(`Timeout Set in ${this.tabId}. # of timeout is ${this.timeout}`)
  }

  clearTimeoutHandler() {
    timestampedLog(`Job done in ${this.tabId}. Clear timeout: ${this.timeout}`)
    clearTimeout(this.timeout)
  }

  finish(tabId: number) {
    timestampedLog("Jobs done!", this)
    chrome.webNavigation.onCompleted.removeListener(this.onLoadListener)
    this.currentIndex = 0
  }

  throwError(msg: string): never {
    throw new Error(msg)
  }
}

export default Crawler