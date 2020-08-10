import $ from 'jquery'


class InfoBox {
    div: HTMLDivElement

    constructor(text: string, baseColor: { color: string, contrast: string }) {
        const backgroundColor = baseColor.color
        const fontColor = baseColor.contrast

        this.div = document.createElement("div")
        const textNode = document.createTextNode(text)

        this.div.appendChild(textNode)
        this.div.style.position = "absolute"
        this.div.style.backgroundColor = backgroundColor
        this.div.style.color = fontColor
        this.div.style.zIndex = "9999"
        this.div.style.padding = '1px 10px'
    }

    set position(position: [number, number]) {
        $(this.div).offset({ left: position[0], top: position[1] })
    }

    insert() {
        document.body.appendChild(this.div)
    }
}

export default InfoBox