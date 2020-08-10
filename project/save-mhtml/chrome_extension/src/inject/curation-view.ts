import { timestampedLog } from '../modules/debugger'
import AnswerOverlay from './overlay/answer'
// import Readability from "./readability"
const Readability = require("./readability")


export function curation(answerData: any[]) {
    timestampedLog("Running in ", parent.frames.length)
    curationAnswer(answerData)
    extractedAnswer()
}

function curationAnswer(answerData: any[]) {
    timestampedLog(answerData)
    answerData.forEach((answer: any) => {
        const cssSelector = answer["css_selector"]
        const mainContent: HTMLElement | null = <HTMLElement>document.querySelector(cssSelector)
        timestampedLog("mc ", mainContent)
        if (mainContent !== null) {
            AnswerOverlay.drawAnswer(mainContent, answer["name"])
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

function extractedAnswer() {
    const documentClone = document.cloneNode(true)
    const article = new Readability(documentClone).parse()
    console.log(article)
}