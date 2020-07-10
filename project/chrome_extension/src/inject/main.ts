import { timestampedLog } from '../modules/debugger'
import WebPage from './webpage'


let completlyLoaded: boolean = false
const MAX_TIMEOUT = 15000
let webpage: WebPage

// timestampedLog("Browser has decided running script! Wait window full loading")
timestampedLog("Script injected at the beginning! Wait window full loading")
setTimeout(() => {
  if (!completlyLoaded) {
    timestampedLog("Loading delayed... Force to run script")
  }
}, MAX_TIMEOUT)

window.addEventListener('load', () => {
  timestampedLog("window loaded")
  if (!completlyLoaded) {
    completlyLoaded = true
    preprocess()
  }
})

function main() {
  timestampedLog("inject js starts")
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    timestampedLog("REQUEST from master", request["command"])
    if (!completlyLoaded) forcePreprocessAfterTimeout(MAX_TIMEOUT);

    const response = { status: completlyLoaded, webpage: webpage }
    sendResponse(response)
  })
}

function forcePreprocessAfterTimeout(timeout: number) {
  setTimeout(() => {
    if (!completlyLoaded) {
      timestampedLog("Loading delayed... Force to run script")
      completlyLoaded = true
      preprocess()
    }
  }, timeout)
}

function preprocess() {
  timestampedLog("Indexing starts")
  webpage = new WebPage(document)
  webpage.indexing()
  timestampedLog("indexing end", webpage)
}

main()