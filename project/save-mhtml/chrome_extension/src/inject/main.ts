import { timestampedLog } from '../modules/debugger'
import Preprocessor from './preprocessor';

let completlyLoaded: boolean = false
const MAX_TIMEOUT = 15000

timestampedLog("Script injected at the beginning! Wait window full loading")

function main() {
  timestampedLog("inject js starts")

  window.addEventListener('load', () => {
    timestampedLog("window loaded")
    if (!completlyLoaded) {
      completlyLoaded = true
    }
  })

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    timestampedLog("REQUEST from master", request["command"])

    const preprocessor = new Preprocessor()

    const response = { status: completlyLoaded, webpage: preprocessor.webpage }
    sendResponse(response)
  })
}

// function forcePreprocessAfterTimeout(timeout: number) {
//   setTimeout(() => {
//     if (!completlyLoaded) {
//       timestampedLog("Loading delayed... Force to run script")
//       completlyLoaded = true
//       preprocess()
//     }
//   }, timeout)
// }

main()