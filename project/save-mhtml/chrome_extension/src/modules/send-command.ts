import { timestampedLog } from './debugger'

export function sendCommand(request: any): Promise<any> {
    timestampedLog("popup sends command to background")
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(request, response => {
            const lastError = chrome.runtime.lastError
            if (lastError) {
                reject(new Error(lastError.message))
            }
            resolve(response)
        })
    })

}