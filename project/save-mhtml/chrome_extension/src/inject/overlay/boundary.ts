import $ from 'jquery'
import { timestampedLog } from '../../modules/debugger'


type Top = number
type Left = number
export type Coordinates = [Left, Top]

class Boundary {
  left: number
  right: number
  top: number
  bottom: number
  center: Coordinates
  constructor(box: HTMLElement) {
    const offset = $(box).offset()
    const width = $(box).width() ?? 0
    const height = $(box).height() ?? 0

    this.left = offset?.left ?? 0
    this.top = offset?.top ?? 0
    this.right = this.left + width
    this.bottom = this.top + height
    this.center = [(this.left + this.right) / 2, (this.top + this.bottom) / 2]
  }

  distance(coord: Coordinates): number {
    let toCenter = 0
    if (!this.isEnclosed(coord)) {
      toCenter = this.distanceFromCenterOf(coord)
    }
    const dist = toCenter + this.distanceSumVertexToCoord(coord) / 4
    return dist
  }

  distanceSumVertexToCoord(aCoord: Coordinates): number {
    const lt: Coordinates = [this.left, this.top]
    const rt: Coordinates = [this.right, this.top]
    const lb: Coordinates = [this.left, this.bottom]
    const rb: Coordinates = [this.right, this.bottom]

    // const sum = [lt, rt, lb, rb].reduce<number>((acc, cur) => {
    //   const dist = distanceBetweenCoords(aCoord, cur)
    //   return acc + dist
    // }, 0)
    const sorted = [lt, rt, lb, rb].map(vertex => {
      return distanceBetweenCoords(vertex, aCoord)
    }).sort()
    const sum = sorted[0] + sorted[3]
    return sum
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

function distanceBetweenCoords(A: Coordinates, B: Coordinates) {
  const disX = A[0] - B[0]
  const disY = A[1] - B[1]
  return Math.sqrt(Math.abs(disX * disX) + Math.abs(disY * disY));
}

export default Boundary