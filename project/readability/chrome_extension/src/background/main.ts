import { timestampedLog } from '../debug-utils/logger'

function main() {
  timestampedLog("background starts")
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendCommandToCurrentTab(message)
  })
}


function sendCommandToCurrentTab(message: any) {
  chrome.tabs.query({ active: true, currentWindow: true }, result => {
    const tabId: number = result[0].id ?? noTabFoundError()
    chrome.tabs.sendMessage(tabId, message, response => {
      timestampedLog("In background", response)
    })
  })
}

function noTabFoundError(): never {
  console.log("Error")
  throw new Error("There is no active window or tab")
}

main()