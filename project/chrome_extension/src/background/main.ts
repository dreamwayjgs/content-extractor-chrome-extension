import { timestampedLog } from '../modules/debugger'
import { establish, postArticle } from './server'
import Crawler from './crawler'
import 'chrome-extension-async'

async function main() {
  console.log("hello backround")
  establish()
  const crawler = await Crawler.createWithUrlsFromServer()
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.command) {
      case "crawl":
        timestampedLog("Crawl requested")
        chrome.tabs.create({ active: true }, async (tab) => {
          crawler.crawl(tab.id!)
        })
        break
      case "capture":
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id! }, mhtml => {
            timestampedLog("Saved ", mhtml)
            postArticle(6852448, { status: "Manual", saved: true }, mhtml, "/upload")
          })
        });
    }
  });
}

main()