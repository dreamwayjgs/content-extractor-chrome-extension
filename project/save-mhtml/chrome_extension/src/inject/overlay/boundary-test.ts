import Boundary, { Coordinates } from './boundary'
import Border from './border'
import { createMarker } from '../extractors/center-fence'


class TestBoundary {
  boxElem: HTMLElement
  canvas: HTMLCanvasElement
  constructor() {
    const boxElem = document.createElement('div')
    boxElem.style.position = "absolute"
    boxElem.style.width = "100px"
    boxElem.style.height = "100px"
    boxElem.style.top = "100px"
    boxElem.style.left = "100px"
    boxElem.style.outline = "solid 1px #666"
    document.body.appendChild(boxElem)
    this.boxElem = boxElem

    const canvas = document.createElement("canvas")
    canvas.width = window.outerWidth
    canvas.height = window.outerHeight
    canvas.style.margin = "0"
    canvas.style.padding = "0"
    document.body.appendChild(canvas)
    this.canvas = canvas
  }

  testHeron(point: Coordinates) {
    console.log("Run test Heron")
    const boxElem = this.boxElem
    const canvas = this.canvas

    const border = new Border("red")
    border.cover(boxElem)

    const marker = createMarker(point, "green", "")

    const boundary = new Boundary(boxElem)
    const [A, B] = boundary.closestLineTo(point)
    console.log("TO RECT", A, B)

    const perpendicular = boundary.distanceVertexTo(point, "heron")
    console.log("perp", perpendicular)


    const ctx = canvas.getContext("2d")!
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(A.vertex[0], A.vertex[1]);
    ctx.stroke();

    console.log(point)
    console.log(A.vertex)

    ctx.strokeStyle = "#0000FF";
    ctx.beginPath();
    ctx.moveTo(point[0], point[1])
    ctx.lineTo(B.vertex[0], B.vertex[1])
    ctx.stroke()

    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(point[0], point[1])
    ctx.lineTo(point[0], point[1] - perpendicular)
    ctx.stroke()

    ctx.beginPath();
    ctx.moveTo(point[0], point[1])
    ctx.lineTo(point[0] - perpendicular, point[1])
    ctx.stroke()

  }
}

export default TestBoundary