import { timestampedLog } from '../../modules/debugger'
import $ from 'jquery'


abstract class Overlay {
    abstract build(): void
    abstract draw(): void
}

class AnswerOverlay extends Overlay {
    static boxes: AnswerOverlay[] = []
    targetElem: HTMLElement
    box: HTMLElement
    position: [number, number] = [0, 0]
    size: [string, string] = ['auto', 'auto']
    text: string = ''
    color: string
    constructor(targetElem: HTMLElement, text: string) {
        super()
        this.targetElem = targetElem
        const offset = $(targetElem).offset()
        if (offset) this.position = [offset.left, offset.top];

        const box = document.createElement("div")
        const textNode = document.createTextNode(text)
        this.color = getRandomColor()
        box.appendChild(textNode)
        box.style.position = "absolute"
        box.style.background = this.color
        box.style.color = "white"
        box.style.zIndex = "9999"
        box.style.paddingLeft = "10px"
        box.style.paddingRight = "10px"
        $(box).addClass("curation-infobox")

        this.box = box
        $(this.box).offset({ left: this.position[0], top: this.position[1] })
        document.body.appendChild(this.box)
        AnswerOverlay.sperate(this.box)
        timestampedLog("after nudge", $(this.box).offset())

        AnswerOverlay.boxes.push(this)
    }

    build() {

    }

    draw() {

    }

    static drawAnswer(targetElem: HTMLElement, text: string) {

    }

    static sperate(aBox: HTMLElement) {
        timestampedLog("Before nudge", $(aBox).offset())
        AnswerOverlay.boxes.forEach(existedBox => {
            const [left, top] = nudgeNewBox(existedBox.box, aBox)
            $(aBox).offset({ top: top, left: left })
        })
    }
}

export default AnswerOverlay

class InfoBox {

}

class Coordinate {
    left: number
    right: number
    top: number
    bottom: number
    constructor(box: HTMLElement) {
        const offset = $(box).offset()
        const width = $(box).width() ?? 0
        const height = $(box).height() ?? 0

        this.left = offset?.left ?? 0
        this.top = offset?.top ?? 0
        this.right = this.left + width
        this.bottom = this.top + height
    }
}

function nudgeNewBox(boxA: HTMLElement, boxB: HTMLElement): [number, number] {
    const coordA = new Coordinate(boxA)
    const coordB = new Coordinate(boxB)
    timestampedLog("Compare", coordA, coordB)
    let { left, top } = coordB
    if (coordA.right > coordB.left || coordA.bottom > coordB.top) {
        left = coordA.right + 20 // padding
    }
    return [left, top]
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}