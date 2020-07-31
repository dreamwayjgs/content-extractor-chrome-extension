import { timestampedLog } from '../modules/debugger'

export function sendCommand(msg: string, command: string): Promise<any> {
    timestampedLog("curation request")
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
            msg: msg,
            command: command
        }, response => {
            const lastError = chrome.runtime.lastError
            if (lastError) {
                reject(new Error(lastError.message))
            }
            resolve(response)
        })
    })

}