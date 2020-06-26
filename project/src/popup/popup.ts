import { timestampedLog } from '../modules/debugger'

const saveButton: HTMLElement | null = document.getElementById("save")

window.onload = () => {
  if (!!saveButton) {
    saveButton.addEventListener('click', (ev: MouseEvent) => {
      timestampedLog("save request")
      chrome.runtime.sendMessage({
        msg: "Save me!"
      }, response => {
        timestampedLog("backround's reply: ", response)
      })
    })
  }
}