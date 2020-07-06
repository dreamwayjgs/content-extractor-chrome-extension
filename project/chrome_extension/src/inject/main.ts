import { timestampedLog } from '../modules/debugger'

timestampedLog("inject js starts")
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  timestampedLog(request)
  const mhtml = "mhtml"
  sendResponse(mhtml)
})

