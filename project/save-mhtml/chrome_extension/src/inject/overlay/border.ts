import $ from 'jquery'


class Border {
    left: HTMLDivElement
    right: HTMLDivElement
    top: HTMLDivElement
    bottom: HTMLDivElement
    constructor(color: string = "red", thickness: string = '3px') {
        this.left = document.createElement("div")
        this.right = document.createElement("div")
        this.top = document.createElement("div")
        this.bottom = document.createElement("div")

        this.left.style.position = "absolute"
        this.right.style.position = "absolute"
        this.top.style.position = "absolute"
        this.bottom.style.position = "absolute"

        this.left.style.zIndex = "9999"
        this.right.style.zIndex = "9999"
        this.top.style.zIndex = "9999"
        this.bottom.style.zIndex = "9999"

        this.color = color
        this.thickness = thickness
    }

    set color(color: string) {
        this.left.style.backgroundColor = color
        this.right.style.backgroundColor = color
        this.top.style.backgroundColor = color
        this.bottom.style.backgroundColor = color
    }

    set thickness(thickness: string) {
        this.left.style.width = thickness
        this.right.style.width = thickness
        this.top.style.height = thickness
        this.bottom.style.height = thickness

    }

    set position(position: [number, number]) {
        const w = parseInt(this.top.style.width, 10)
        const h = parseInt(this.left.style.height, 10)

        $(this.left).offset({ left: position[0], top: position[1] })
        $(this.top).offset({ left: position[0], top: position[1] })
        $(this.right).offset({ left: position[0] + w, top: position[1] })
        $(this.bottom).offset({ left: position[0], top: position[1] + h })

    }

    set size(size: [width, height]) {
        const w = size[0] + "px"
        const h = size[1] + "px"
        this.top.style.width = w
        this.bottom.style.width = w
        this.left.style.height = h
        this.right.style.height = h
    }

    cover(targetElem: HTMLElement) {
        const w = $(targetElem).width() ?? 300
        const h = $(targetElem).height() ?? 300
        this.size = [w, h]

        const offset = $(targetElem).offset()
        if (offset) this.position = [offset.left, offset.top];

    }

    insert() {
        document.body.appendChild(this.left)
        document.body.appendChild(this.right)
        document.body.appendChild(this.top)
        document.body.appendChild(this.bottom)
    }
}

type width = number
type height = number

export default Border