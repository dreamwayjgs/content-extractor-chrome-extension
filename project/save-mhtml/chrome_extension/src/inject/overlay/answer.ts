import { timestampedLog } from '../../modules/debugger'
import $ from 'jquery'
import Border from './border'
import InfoBox from './infobox'
import Palette from './palette'


abstract class Overlay {
    abstract draw(): void
}

class AnswerOverlay extends Overlay {
    static overlays: AnswerOverlay[] = []

    targetElem: HTMLElement
    border: Border
    infoBox: InfoBox
    position: [number, number] = [0, 0]
    size: [string, string] = ['auto', 'auto']
    text: string = ''
    baseColor: { color: string, contrast: string }
    constructor(targetElem: HTMLElement, text: string) {
        super()
        this.baseColor = Palette.getColor()

        this.targetElem = targetElem
        const offset = $(targetElem).offset()
        if (offset) this.position = [offset.left, offset.top];

        // Place infobox
        this.infoBox = new InfoBox(text, this.baseColor)
        this.infoBox.position = [this.position[0], this.position[1]]

        // BORDER
        this.border = new Border(this.baseColor.color)
        this.border.cover(targetElem)
    }

    draw() {
        this.infoBox.insert()
        this.border.insert()
    }

    static drawAnswer(targetElem: HTMLElement, text: string) {
        const answerElem = new AnswerOverlay(targetElem, text)
        answerElem.draw()
        AnswerOverlay.sperate(answerElem.infoBox.div)
        AnswerOverlay.overlays.push(answerElem)
    }

    static sperate(aBox: HTMLElement) {
        timestampedLog("Before nudge", $(aBox).offset())
        AnswerOverlay.overlays.forEach(existedBox => {
            const [left, top] = nudgeNewBox(existedBox.infoBox.div, aBox)
            $(aBox).offset({ top: top, left: left })
        })
    }
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


export default AnswerOverlay