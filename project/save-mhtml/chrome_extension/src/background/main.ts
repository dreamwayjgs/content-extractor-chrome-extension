import { timestampedLog } from '../modules/debugger'
import { establish, postArticle } from './server'
import Crawler from './crawler'
import 'chrome-extension-async'
import Curator from './curator'

function main() {
  console.log("hello backround")
  establish()
  // const crawler = await Crawler.pickPagesWithId(ids)
  chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    const command = request.command
    switch (true) {
      case /^crawl/.test(command):
        const crawler = await singleTest(true)
        timestampedLog("Crawl requested")
        chrome.tabs.create({ active: true }, tab => {
          console.assert(tab.id !== undefined)
          console.log("New tab updated")
          crawler.crawl(tab.id!)
        })
        break
      case /^capture/.test(command):
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id! }, mhtml => {
            timestampedLog("Saved ", mhtml)
            postArticle(6852448, { status: "Manual", saved: true }, mhtml, "/upload")
          })
        });
        break
      case /^curation$/.test(command):
        timestampedLog("Curation requested")
        const curator = await Curator.createCuratorWithSelectedIds([4613259,
        ])
        // const curator = await Curator.createCuratorWithAllIds()
        chrome.tabs.create({ active: true }, tab => {
          console.assert(tab.id !== undefined)
          console.log("New tab updated")
          if (tab.id) curator.start(tab.id)
        })
        break
      case /^curation-/.test(command):
        timestampedLog("Curation Explorer")
        const option = command.replace("curation-", "")
        const currentCurator = Curator.getCurator()
        if (option === "next") currentCurator.next()
        else if (option === "prev") currentCurator.prev()
        break
      case /^extraction/.test(command):
        const extractor: string = request.extractor!
        timestampedLog("Extraction requested")
        break
      default:
        timestampedLog("Unknown Command: ", request)
    }
  });
}

function singleTest(isTest = false) {
  if (isTest) {
    const ids = [5635939]
    // const ids = ["4344906"]
    return Crawler.pickPagesWithId(ids)
  }
  else return Crawler.gatherPagesWithStatus("all");
}

main()