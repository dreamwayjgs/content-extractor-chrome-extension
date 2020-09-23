import { timestampedLog } from '../modules/debugger'
import { establish, postArticle, postCenterValues } from './server'
import Crawler from './crawler'
import 'chrome-extension-async'
import Curator from './curator'
import Extractor from './extractor'

function main() {
  console.log("hello backround")
  establish()

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
          console.assert(tabs[0].id !== undefined)
          console.log("crawl in current tab")
          crawler.crawlOne(tabs[0].id!)
        });
        break
      case /^curation$/.test(command):
        timestampedLog("Curation requested")
        const curator = await Curator.createCuratorWithSelectedIds([5635861], request.option.auto)
        // const curator = await Curator.createCuratorWithAllIds(request.option.auto, { failed: false })
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
        Extractor.runOnce()
        break
      case /^request-center-statistics/.test(command):
        postCenterValues(request.aid, request.data)
        break
      case /^test/.test(command):
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          console.assert(tabs[0].id !== undefined)
          chrome.tabs.sendMessage(tabs[0].id!, {
            command: "test"
          })

        });
        break
      default:
        // testSession(true)
        timestampedLog("Unknown Command: ", request)
    }
  });
}

function singleTest(isTest = false) {
  if (isTest) {
    const ids = [3453021, 3870781, 3636199]
    // const ids = ["4344906"]
    return Crawler.pickPagesWithId(ids)
  }
  else return Crawler.gatherPagesWithStatus("failed");
}

function testSession(debug = false) {
  if (!debug) return;
  timestampedLog("Run TEST...")
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0]
    if (tab.id) {
      timestampedLog("Run TEST in tab ", tab.id)
      chrome.tabs.sendMessage(tab.id, {
        command: "test"
      })
    }
    else console.log("No TAB TO TEST")
  })
}

main()