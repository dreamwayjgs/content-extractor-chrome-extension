import { timestampedLog } from '../modules/debugger'
import { sendCommand } from "../modules/send-command"

export function extractAction(elem: HTMLElement) {
  const runAllButton = <HTMLElement>elem.querySelector("#all")

  requestExtraction(runAllButton)
}

function requestExtraction(btnElement: HTMLElement) {
  btnElement.addEventListener('click', () => {
    const msg = "Extraction Starts: ALL"
    const command = "extraction"
    sendCommand({ msg: msg, command: command }).then(response => {
      timestampedLog(response)
    }).catch(reason => {
      timestampedLog(reason)
    })
  })
}