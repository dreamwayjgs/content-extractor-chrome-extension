import { timestampedLog } from '../modules/debugger'
import AnswerOverlay from './overlay/answer'


export function curation(answerData: any[]) {
    timestampedLog("Running in ", parent.frames.length)
    timestampedLog(answerData)
    let ansverOverlays: AnswerOverlay[] = []
    answerData.forEach((answer: any) => {
        const cssSelector = answer["css_selector"]
        timestampedLog("Selector ", cssSelector)
        const mainContent: HTMLElement | null = <HTMLElement>document.querySelector(cssSelector)
        timestampedLog("mc ", mainContent)
        if (mainContent !== null) {
            drawInfo(mainContent, answer["name"])
        }
        else {
            timestampedLog("You have null.. send this target")
            chrome.runtime.sendMessage({
                info: "curation-no-main-content",
                message: "No Main Content",
                answer: answer
            })
        }
    })

}

function drawInfo(elem: HTMLElement, info: string) {
    return new AnswerOverlay(elem, info)
}
