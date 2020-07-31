import { timestampedLog } from '../modules/debugger'
import $ from 'jquery'
import './curation.scss'


export function curation(answerData: any) {
    timestampedLog("Running in ", parent.frames.length)
    timestampedLog(answerData)
    answerData.foreach((answer: any) => {
        const cssSelector = answer["css_selector"]
        timestampedLog("Selector ", cssSelector)
        const mainContent = <HTMLElement>document.querySelector(cssSelector)
        timestampedLog("mc ", mainContent)
        drawOutline(mainContent)
        drawInfo(mainContent, answer["name"])
    })

}

function drawOutline(elem: HTMLElement) {
    elem.style.outline = "3px solid red"
}

function drawInfo(elem: HTMLElement, info: string) {
    return new InfoBox(elem, info)
}

class InfoBox {
    static boxs: InfoBox[] = []
    targetElem: HTMLElement
    box: HTMLElement
    position: [number, number] = [0, 0]
    size: [string, string] = ['auto', 'auto']
    text: string = ''
    constructor(targetElem: HTMLElement, text: string) {
        this.targetElem = targetElem
        const offset = $(targetElem).offset()
        if (offset) this.position = [offset.left, offset.top];

        const box = document.createElement("div")
        const textNode = document.createTextNode(text)
        box.appendChild(textNode)
        box.style.position = "absolute"
        box.style.background = getRandomColor()
        box.style.color = "white"
        box.style.zIndex = "9999"
        box.style.paddingLeft = "1em"
        box.style.paddingRight = "1em"
        $(box).addClass("curation-infobox")

        this.box = box
        $(this.box).offset({ left: this.position[0], top: this.position[1] })

        document.body.appendChild(this.box)
        InfoBox.boxs.push(this)
    }
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
