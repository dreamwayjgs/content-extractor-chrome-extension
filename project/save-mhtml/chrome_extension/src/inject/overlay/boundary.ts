import $ from 'jquery'
import { timestampedLog } from '../../modules/debugger'


type Top = number
type Left = number
export type Coordinates = [Left, Top]

class Boundary {
  rect: DOMRect
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
  center: Coordinates
  constructor(box: HTMLElement) {
    this.rect = box.getBoundingClientRect()
    const { left, top, right, bottom, width, height } = this.rect

    this.left = left
    this.top = top
    this.right = right
    this.bottom = bottom
    this.width = width
    this.height = height
    if (width * height === 0) {
      throw new ZeroAreaElementException("This Element has no area")
    }
    this.center = [(this.left + this.right) / 2, (this.top + this.bottom) / 2]
  }

  closestLineTo(aCoord: Coordinates) {
    const sorted = this.nearVertexesFrom(aCoord)
    return [sorted[0], sorted[1]]
  }

  distance(coord: Coordinates): number {
    let toCenter = 0
    if (!this.isEnclosed(coord)) {
      toCenter = this.distanceFromCenterOf(coord)
    }
    const nearness = this.distanceVertexTo(coord, "heron")
    const dist = toCenter + nearness
    console.assert(!isNaN(dist), "WHAT?", toCenter, nearness)
    return dist
  }

  nearVertexesFrom(aCoord: Coordinates) {
    const lt: Coordinates = [this.left, this.top]
    const rt: Coordinates = [this.right, this.top]
    const lb: Coordinates = [this.left, this.bottom]
    const rb: Coordinates = [this.right, this.bottom]

    const sorted = [lt, rt, lb, rb].map(vertex => {
      return {
        vertex: vertex,
        dist: distanceBetweenCoords(vertex, aCoord)
      }
    }).sort((a, b) => a.dist - b.dist)
    if (this.width === 0 || this.height === 0) { // vertical / horizontal line
      console.log("I'm BOX", this)
      console.log("Line", [sorted[0], sorted[2], sorted[2], sorted[2]])
      return [sorted[0], sorted[2], sorted[2], sorted[2]]
    }
    return sorted
  }

  distanceVertexTo(aCoord: Coordinates, option = "sum"): number {
    const sorted = this.nearVertexesFrom(aCoord)
    switch (option) {
      case "min":
        return sorted[0].dist
      case "sum":
        return sorted.reduce<number>((acc, cur) => acc + cur.dist, 0)
      case "heron": // from "Heron's formula"
        const a = sorted[0].dist
        const b = sorted[1].dist
        const c = distanceBetweenCoords(sorted[0].vertex, sorted[1].vertex)
        return heronsFormular(a, b, c)
      case "sum-of-min-max":
      default:
        return sorted[0].dist + sorted[3].dist
    }
  }

  distanceSumFromVertexOf(aTarget: HTMLElement): number {
    const aBoundary = new Boundary(aTarget)
    const lt: Coordinates = [aBoundary.left, aBoundary.top]
    const rt: Coordinates = [aBoundary.right, aBoundary.top]
    const lb: Coordinates = [aBoundary.left, aBoundary.bottom]
    const rb: Coordinates = [aBoundary.right, aBoundary.bottom]

    const sum = this.distanceFromCenterOf(lt) + this.distanceFromCenterOf(rt)
      + this.distanceFromCenterOf(lb) + this.distanceFromCenterOf(rb)
    return sum
  }

  distanceFromCenterOf(aTarget: HTMLElement | Coordinates): number {
    let targetCoord: Coordinates
    if (aTarget instanceof HTMLElement) {
      const aBoundary = new Boundary(aTarget)
      targetCoord = aBoundary.center
    }
    else targetCoord = aTarget
    return distanceBetweenCoords(this.center, targetCoord)
  }

  isOnLeft(target: Boundary) {
    return target.right < this.left
  }
  isOnRight(target: Boundary) {
    return this.right < target.left
  }
  isOnTop(target: Boundary) {
    return target.bottom < this.top
  }
  isOnBottom(target: Boundary) {
    return this.bottom < target.top
  }
  isOverlapped(target: Boundary) {
    return !(this.isOnLeft(target) ||
      this.isOnRight(target) ||
      this.isOnTop(target) ||
      this.isOnBottom(target))
  }

  isAtLeft(target: Coordinates) {
    return target[0] < this.left
  }
  isAtRight(target: Coordinates) {
    return this.right < target[0]
  }
  isAtTop(target: Coordinates) {
    return target[1] < this.top
  }
  isAtBottom(target: Coordinates) {
    return this.bottom < target[1]
  }
  isEnclosed(target: Coordinates) {
    return !(this.isAtLeft(target) ||
      this.isAtRight(target) ||
      this.isAtTop(target) ||
      this.isAtBottom(target)
    )
  }
}

function heronsFormular(a: number, b: number, c: number): number {
  // https://en.wikipedia.org/wiki/Heron%27s_formula
  if (a * b * c === 0) return 0;

  const a2 = Math.pow(a, 2)
  const b2 = Math.pow(b, 2)
  const c2 = Math.pow(c, 2)
  const first = -a2 + b2 + c2
  const second = first / (2 * c)
  const third = Math.pow(second, 2)
  const fourth = b2 - third
  const result = Math.sqrt(fourth)
  console.assert(a * b * c, "HERON ABC", a, b, c, first, second, third, fourth, result)
  return result
}

function distanceBetweenCoords(A: Coordinates, B: Coordinates) {
  if (A[0] === B[0]) return Math.abs(A[1] - B[1]);
  if (A[1] === B[1]) return Math.abs(A[0] - B[0]);
  const disX = A[0] - B[0]
  const disY = A[1] - B[1]
  return Math.sqrt(Math.abs(disX * disX) + Math.abs(disY * disY));
}

export class ZeroAreaElementException extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ZeroAreaElementException"
  }
}

export default Boundary