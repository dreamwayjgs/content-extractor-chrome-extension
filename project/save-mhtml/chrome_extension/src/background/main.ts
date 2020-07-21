import { timestampedLog } from '../modules/debugger'
import { establish, postArticle } from './server'
import Crawler from './crawler'
import 'chrome-extension-async'

async function main() {
  console.log("hello backround")
  establish()
  const crawler = await singleTest(true)
  // const crawler = await Crawler.pickPagesWithId(ids)
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.command) {
      case "crawl":
        timestampedLog("Crawl requested")
        chrome.tabs.create({ active: true }, tab => {
          console.assert(tab.id !== undefined)
          console.log("New tab updated")
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

function singleTest(isTest = false) {
  if (isTest) {
    // const ids = ["3819052", "5486199", "4344906", "3868535", "5477111", "3455302", "5256691", "3460924", "4914667", "4834017", "3374749", "7027811", "4791863", "4442317", "3593219", "5538150", "3471066", "1975"]
    const ids = ["6852448"]
    return Crawler.pickPagesWithId(ids)
  }
  else return Crawler.gatherPagesWithStatus("all");
}

main()