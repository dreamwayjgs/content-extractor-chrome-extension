import { timestampedLog } from '../modules/debugger'

export function crawlAllAction(btnElement: HTMLElement) {
    btnElement.addEventListener('click', (ev: MouseEvent) => {
        timestampedLog("crawl request")
        chrome.runtime.sendMessage({
            msg: "Crawl starts",
            command: "crawl"
        }, response => {
            timestampedLog("backround's reply: ", response)
        })
    })
}

export function crawlOnceAction(btnElement: HTMLElement) {
    btnElement.addEventListener('click', () => {
        timestampedLog("saveNowButton request")
        chrome.runtime.sendMessage({
            msg: "Save now",
            command: "capture"
        }, response => {
            timestampedLog("backround's reply: ", response)
        })
    })
}
