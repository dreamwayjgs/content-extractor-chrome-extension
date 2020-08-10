import Palette from './palette'


class InfoBox {
    div: HTMLDivElement
    constructor(text: string) {
        const baseColor = Palette.getColor()
        const backgroundColor = baseColor.color
        const fontColor = baseColor.contrast

        this.div = document.createElement("div")
        const textNode = document.createTextNode(text)

        this.div.appendChild(textNode)
        this.div.style.backgroundColor = backgroundColor
        this.div.style.color = fontColor
        this.div.style.zIndex = "9999"
    }
}

export default InfoBox