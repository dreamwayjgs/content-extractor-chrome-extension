import { timestampedLog } from '../modules/debugger'
import { establish, getArticles, getArticlesById, postCenterValues } from './server'
import Crawler from './crawler'
import 'chrome-extension-async'
import Curator from './curator'
import Extractor from './extractor'
import Article from '../entities/Article'

function main() {
  console.log("hello backround")
  establish()

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const command = request.command
    let response: any = {}
    console.log("BACKGROUND GOT", request, sender)
    switch (true) {
      case /^view/.test(command):
        if (request.testMode) {
          // getArticlesById([296]).then(body => {
          getArticlesById([6, 21, 296]).then(body => {
            response["message"] = "view"
            response["articles"] = body
            console.log(body)
            sendResponse(response)
          })
        }
        getArticles().then(body => {
          response["message"] = "view"
          response["articles"] = body
          sendResponse(response)
        })
        break
      case /^crawl/.test(command):
        const articles = Article.fromArray(request.body)
        const crawler = new Crawler(articles)
        console.log("GET READY", articles, crawler)
        chrome.tabs.create({ active: true }, tab => {
          console.assert(tab.id !== undefined)
          console.log("New tab updated")
          crawler.crawl(tab.id!)
        })
        // singleTest(true).then(crawler => {
        //   timestampedLog("Crawl requested")
        //   chrome.tabs.create({ active: true }, tab => {
        //     console.assert(tab.id !== undefined)
        //     console.log("New tab updated")
        //     crawler.crawl(tab.id!)
        //   })
        // })
        break
      // case /^capture/.test(command):
      //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //     console.assert(tabs[0].id !== undefined)
      //     console.log("crawl in current tab")
      //     crawler.crawlOne(tabs[0].id!)
      //   });
      //   break
      case /^curation$/.test(command):
        timestampedLog("Curation requested")
        Curator.createCuratorWithSelectedIds([4028570, 3938741, 6216964, 3818059, 4834017, 5497523, 3522203], request.option.auto).then(curator => {
          chrome.tabs.create({ active: true }, tab => {
            console.assert(tab.id !== undefined)
            console.log("New tab updated")
            if (tab.id) curator.start(tab.id)
          })
        })
        // const curator = await Curator.createCuratorWithAllIds(request.option.auto, { failed: false })

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
        timestampedLog("Unknown Command: ", request)
        response["error"] = request
    }
    return true
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