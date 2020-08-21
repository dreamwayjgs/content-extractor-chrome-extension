import { timestampedLog } from '../modules/debugger'
import Preprocessor from './preprocessor'
import { curation } from './curation-view'
import { extractedAnswers } from './extractor-view'
import { runTest } from './test'

timestampedLog("Script injected at the beginning! Wait window full loading")

function main() {
  timestampedLog("inject js starts")

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    timestampedLog("REQUEST from master", request.command)
    const command = request.command
    switch (command) {
      case "crawl":
        const preprocessor = new Preprocessor()
        const response = { webpage: preprocessor.webpage }
        sendResponse(response)
        break
      case "curation":
        const extractedInCuration = curation(request.answerData)
        if (extractedInCuration) sendResponse(extractedInCuration)
        break
      case "extract":
        const extracted = extractedAnswers()
        sendResponse(extracted)
        break
      case "test":
        console.log("runTEST")
        runTest()
        break
    }
  })
}

main()