import Article from "../entities/Article"
import { getArticlesById, getArticleFile, getArticlesUrl, getArticleCheckedAnswer } from "./server"
import { timestampedLog } from "../modules/debugger"


class Curator {
    private static instance: Curator
    tabId: number = chrome.tabs.TAB_ID_NONE
    articles: Article[]
    currentIndex: number = 0
    onDownloadAction: (downloadDelta: chrome.downloads.DownloadDelta) => void
    onPageLoadAction: (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => void

    constructor(articles: Article[]) {
        this.articles = articles
        this.onDownloadAction = this.openOnDownloaded.bind(this)
        this.onPageLoadAction = this.loadAnswer.bind(this)
    }

    static getCurator() {
        if (!Curator.instance) {
            throw new Error("There is no curator now")
        }
        return Curator.instance
    }

    static async createCuratorWithAllIds() {
        const articles = await getArticlesUrl("")
        Curator.instance = new Curator(articles)
        return Curator.instance
    }

    static async createCuratorWithSelectedIds(ids: number[]) {
        const articles = await getArticlesById(ids)
        Curator.instance = new Curator(articles)
        return Curator.instance
    }

    start(tabId: number) {
        chrome.downloads.onChanged.addListener(this.onDownloadAction)
        chrome.webNavigation.onCompleted.addListener(this.onPageLoadAction)
        this.tabId = tabId
        this.loadPage(this.articles[0])
    }

    next() {
        timestampedLog("next")
        if (this.currentIndex + 1 < this.articles.length) {
            this.currentIndex++;
            const article = this.articles[this.currentIndex]
            this.loadPage(article)
        }
        else {
            //Popup: End of Pages
            timestampedLog("END of pages")
        }
    }

    prev() {
        timestampedLog("prev")
        if (this.currentIndex - 1 >= 0) {
            this.currentIndex--;
            const article = this.articles[this.currentIndex]
            this.loadPage(article)
        }
        else {
            //Popup: Beginning of Pages
            timestampedLog("Beginning of pages")
        }

    }

    finish() {
        // chrome.downloads.onChanged.removeListener(this.onDownloadAction)
    }

    loadPage(article: Article) {
        if (article.filename) {
            timestampedLog("Open previously downloaded page")
            this.openPage(article)
        }
        else {
            this.downloadPage(article.id)
        }
    }

    downloadPage(id: number) {
        const url = getArticleFile(id)
        chrome.downloads.download({
            url: url,
            filename: `content-extraction/${id}.mhtml`
        }, downloadId => {
            timestampedLog("Download starts", downloadId)
        })
    }

    openOnDownloaded(downloadDelta: chrome.downloads.DownloadDelta) {
        const state = downloadDelta.state
        if (downloadDelta.filename) {
            this.articles[this.currentIndex].filename = downloadDelta.filename.current
        }
        if (state && state.current === "complete") {
            const article = this.articles[this.currentIndex]
            timestampedLog("Open newly downloaded page")
            this.openPage(article)
        }
    }

    openPage(article: Article) {
        chrome.tabs.update({ url: `file://${article.filename}` })
    }

    loadAnswer(details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
        setTimeout(() => {
            const frameId = details.frameId
            if (frameId !== 0) return;
            const article = this.articles[this.currentIndex]
            timestampedLog("Loading Compeleted")
            getArticleCheckedAnswer(article.id).then(body => {
                timestampedLog("This page answers: ", body)
                timestampedLog("Called on ", frameId)
                // this.sendAnswerDataToPopup(body)
                this.sendAnswerDataToContentScript(body)
            })
        }, 2000)
    }

    sendAnswerDataToPopup(answerData: any) {
        timestampedLog("To popup", answerData)
        chrome.runtime.sendMessage({ answerData: answerData }, () => {
            const lastError = chrome.runtime.lastError
            if (lastError)
                timestampedLog("In popup", lastError)
        })
    }

    sendAnswerDataToContentScript(answerData: any) {
        timestampedLog("To content", answerData)
        chrome.tabs.sendMessage(this.tabId, { command: "curation", answerData: answerData }, () => {
            const lastError = chrome.runtime.lastError
            if (lastError)
                timestampedLog("In content", lastError)
        })
    }
}

export default Curator