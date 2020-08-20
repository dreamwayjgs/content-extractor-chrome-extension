import { sendCommand } from "../modules/send-command"
import { timestampedLog } from "../modules/debugger"

export function testAction(elem: HTMLElement) {
  const runAllButton = <HTMLElement>elem.querySelector(".all")

  requestTest(runAllButton)
}

function requestTest(btnElement: HTMLElement) {
  btnElement.addEventListener('click', () => {
    const msg = "Extraction Starts: ALL"
    const command = "test"
    sendCommand({ msg: msg, command: command }).then(response => {
      timestampedLog(response)
    }).catch(reason => {
      timestampedLog(reason)
    })
  })
}