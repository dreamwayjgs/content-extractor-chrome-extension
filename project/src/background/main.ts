import { timestampedLog } from '../modules/debugger'

timestampedLog("background starts")

chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender) => {
  timestampedLog("request received", message, "from", sender)
  const tabQuery = { active: true, currentWindow: true }
  chrome.tabs.query(tabQuery, (tabs: chrome.tabs.Tab[]) => {
    if (tabs.length > 0 && !!tabs[0].id) {
      const tabId = tabs[0].id
      chrome.pageCapture.saveAsMHTML({ tabId: tabId }, savePage)
    }
  })
})

function savePage(mhtmlData: Blob) {
  mhtmlData.text().then(text => {
    timestampedLog("Saved", text)
  })
}