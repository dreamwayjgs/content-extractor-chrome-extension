import { timestampedLog } from '../modules/debugger'

const saveButton: HTMLElement | null = document.getElementById("save")
const saveNowButton: HTMLElement | null = document.getElementById("saveNow")

window.onload = () => {
  if (!!saveButton) {
    saveButton.addEventListener('click', (ev: MouseEvent) => {
      timestampedLog("crawl request")
      chrome.runtime.sendMessage({
        msg: "Crawl starts",
        command: "crawl"
      }, response => {
        timestampedLog("backround's reply: ", response)
      })
    })
  }
  if (!!saveNowButton) {
    saveNowButton.addEventListener('click', () => {
      timestampedLog("saveNowButton request")
      chrome.runtime.sendMessage({
        msg: "Save now",
        command: "capture"
      }, response => {
        timestampedLog("backround's reply: ", response)
      })
    })
  }
}