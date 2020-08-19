import $ from 'jquery'

export const padding = 10

class InfoBox {
  div: HTMLDivElement

  constructor(text: string, baseColor: { color: string, contrast: string }) {
    const backgroundColor = baseColor.color
    const fontColor = baseColor.contrast

    this.div = document.createElement("div")
    const textNode = document.createTextNode(text)

    this.div.appendChild(textNode)
    this.div.className = "hyu-infobox"
    this.div.style.position = "absolute"
    this.div.style.backgroundColor = backgroundColor
    this.div.style.color = fontColor
    this.div.style.zIndex = "9999"
    this.div.style.padding = `1px ${padding}px`
  }

  set position(position: [number, number]) {
    $(this.div).offset({ left: Math.max(0, position[0]), top: Math.max(0, position[1]) })
  }

  insert() {
    document.body.appendChild(this.div)
  }
}

export default InfoBox