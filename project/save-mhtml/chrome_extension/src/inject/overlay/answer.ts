import $ from 'jquery'
import Border from './border'
import InfoBox, { padding } from './infobox'
import Palette from './palette'
import Boundary from './boundary'


abstract class Overlay {
  abstract draw(): void
}

class AnswerOverlay extends Overlay {
  static overlays: AnswerOverlay[] = []

  targetElem: HTMLElement
  border: Border
  infoBox: InfoBox
  position: [number, number] = [0, 0]
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
    AnswerOverlay.overlays.forEach(existedBox => {
      const [left, top] = nudgeNewBox(existedBox.infoBox.div, aBox)
      $(aBox).offset({ top: top, left: left })
    })
  }
}

function nudgeNewBox(boxA: HTMLElement, boxB: HTMLElement): [number, number] {
  const bounceA = new Boundary(boxA)
  const bounceB = new Boundary(boxB)
  let { left, top } = bounceB
  if (bounceA.isOverlapped(bounceB)) {
    left = bounceA.right + 2 * padding
  }
  return [left, top]
}

export default AnswerOverlay