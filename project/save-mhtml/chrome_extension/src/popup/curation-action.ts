import { timestampedLog } from '../modules/debugger'
import { sendCommand } from '../modules/send-command'

export function curationAction(elem: HTMLElement) {
  const startButton = <HTMLElement>elem.querySelector(".start")
  const prevButton = <HTMLElement>elem.querySelector(".prev")
  const nextButton = <HTMLElement>elem.querySelector(".next")
  const automaticStartButton = <HTMLElement>elem.querySelector(".start-auto")

  requestCuration(startButton)
  requestCuration(automaticStartButton, true)
  controlPanel(prevButton, nextButton)
  optionPanel(elem)
}

function requestCuration(btnElement: HTMLElement, auto = false) {
  btnElement.addEventListener('click', (ev: MouseEvent) => {
    timestampedLog("curation request")
    const msg = "Curation starts"
    const command = "curation"
    sendCommand({ msg: msg, command: command, option: { auto: auto } }).then(response => {
      timestampedLog(response)
    }).catch(reason => {
      timestampedLog(reason)
    })
  })
}

function controlPanel(prev: HTMLElement, next: HTMLElement) {
  prev.addEventListener('click', () => {
    timestampedLog("prev")
    const msg = "Curation prev"
    const command = "curation-prev"
    sendCommand({ msg: msg, command: command }).then(response => {
      timestampedLog(response)
    }).catch(reason => {
      timestampedLog(reason)
    })
  })

  next.addEventListener('click', () => {
    timestampedLog("next")
    const msg = "Curation next"
    const command = "curation-next"
    sendCommand({ msg: msg, command: command }).then(response => {
      timestampedLog(response)
    }).catch(reason => {
      timestampedLog(reason)
    })
  })
}

export function optionPanel(parent: HTMLElement) {
  timestampedLog("option panel")
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const answerData = message.answerData
    timestampedLog(answerData)
    parent.appendChild(answerData)
  })
}