import { timestampedLog } from '../debug-utils/logger'
import { send } from 'process'

const readabilityLatestButton: HTMLElement | null = document.getElementById("readability-latest")
const readabilityLegacyButton: HTMLElement | null = document.getElementById("readability-legacy")
const centerToFenceButton: HTMLElement | null = document.getElementById("center-to-fence")

window.onload = () => {
  if (!!readabilityLatestButton) {
    readabilityLatestButton.addEventListener('click', () => {
      sendCommand("readability-latest")
    })
  }
  if (!!readabilityLegacyButton) {
    readabilityLegacyButton.addEventListener('click', () => {
      sendCommand("readability-legacy")
    })
  }
  if (!!centerToFenceButton) {
    centerToFenceButton.addEventListener('click', () => {
      sendCommand("center-to-fence")
    })
  }
}

function sendCommand(command: any) {
  chrome.runtime.sendMessage({
    command: command
  }, response => {
    timestampedLog("background's reply: ", response)
  })
}
