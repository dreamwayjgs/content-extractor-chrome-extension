import Extractor, { ExtractorResult } from "./extractor";
import $ from 'jquery'
import AnswerOverlay from "../overlay/answer";
import Boundary, { Coordinates, ZeroAreaElementException } from '../overlay/boundary'
import Border from "../overlay/border";
import { elementTextPerLink } from './text-and-link'
import { timestampedLog } from "../../modules/debugger";


const DIV_LIKE_TAGS = [
  'div',
  'aside',
  'main',
  'section',
  'nav',
  'article',
  'th',
  'td'
]
const DIV_LIKE_SELECTOR = DIV_LIKE_TAGS.join(',')

type ElementWithDistances = {
  elem: HTMLElement,
  elemHTML: string,
  dist: number[]
}


class CenterFenceExtractor implements Extractor {
  name = "center-fence"
  extractedElement = document.body
  report: ExtractorResult = {
    extractorName: this.name,
    title: "No Title",
    result: "",
    raw: {}
  }
  constructor() { }
  extract() {
    timestampedLog("Starting Extracts")
    let result = $("body")[0]

    const [possibles, centers] = this.closestElementsFromCenters()
    let data = {
      centerCoords: centers,
      reportOfCenters: new Array<any>()
    }
    let maxLinkRatio = 0
    let maxLinkElement: HTMLElement
    possibles.forEach((item, index) => {
      timestampedLog("================Center " + index + " ============")
      AnswerOverlay.drawAnswer(item.elem, `Closest from ${index}`)

      const parents = this.parentDivs(item.elem)
      const reportEachCenter = {
        center: item,
        elements: new Array<any>()
      }
      parents.forEach((elem, index) => {
        const report = elementTextPerLink(elem)
        if (maxLinkRatio < report.linkRatio) {
          console.log("MAX UP!", maxLinkRatio, "TO", report.linkRatio)
          maxLinkRatio = report.linkRatio
          maxLinkElement = elem
        }
        reportEachCenter.elements.push(report)
      })
      data.reportOfCenters.push(reportEachCenter)
      if (maxLinkElement) {
        result = maxLinkElement
      }
    })

    console.log("THIS IS RESULT", data)
    this.extractedElement = result

    this.report = {
      extractorName: this.name,
      title: "Not Found",
      result: this.extractedElement.outerHTML,
      raw: data
    }
    return this.report
  }

  parentDivs(elem: HTMLElement) {
    let result: HTMLElement[] = []
    if (DIV_LIKE_TAGS.includes(elem.tagName.toLowerCase()))
      result.push(elem);
    const parents = Array.from($(elem).parents(DIV_LIKE_SELECTOR))
    return result.concat(parents)
  }

  closestElementsFromCenters(): [ElementWithDistances[], Coordinates[]] {
    const centers = this.examineCenters(5) // 하드코딩
    centers.forEach((center, index) => {
      AnswerOverlay.drawAnswer(createMarker(center, "red", index.toString()), index.toString())
    })

    const elems = Array.from($(":not([class|='hyu'])").filter(":visible"))
    const elemsWithDistancesFromCenters = elems.map(elem => {
      try {
        const boundary = new Boundary(<HTMLElement>elem)
        const distanceFromEachCenters = centers.map(center => boundary.distance(center))
        return {
          elem: elem,
          elemHTML: elem.outerHTML,
          dist: distanceFromEachCenters
        }
      }
      catch (err) {
        return null
      }
    })
    const nonZeroAreaElems: ElementWithDistances[] = elemsWithDistancesFromCenters.filter((el): el is ElementWithDistances => el !== null)
    let closestItems: ElementWithDistances[] = Array(centers.length).fill(nonZeroAreaElems[0])
    nonZeroAreaElems.forEach(item => {
      for (let i = 0; i < item.dist.length; i++) {
        if (item.dist[i] < closestItems[i].dist[i]) {
          closestItems[i] = item
        }
      }
    })
    console.log("CLOSEST ", closestItems)
    return [closestItems, centers]
  }

  getMenuInDocument(answerData: any) {
    try {
      const selector = answerData.nav_selector
      const menuElem = document.querySelector(selector)
      AnswerOverlay.drawAnswer(menuElem, "nav-menu")
    }
    catch (e) {
      if (e instanceof DOMException) {
        console.error("Wrong Menu Selector", answerData)
      }
    }
  }

  examineCenters(numOfCenters = 5): Coordinates[] {
    let count = numOfCenters > 3 ? numOfCenters : 3
    const screenCenter = this.getScreenCenter()
    const docCenter = this.getDocumentCenter()
    const centers: Coordinates[] = []
    console.log("Center 0, last", screenCenter, docCenter)

    centers.push(screenCenter)
    for (let i = 1; i <= (count - 2); i++) {
      const m = i
      const n = count - 1 - i
      const [x1, y1] = screenCenter
      const [x2, y2] = docCenter
      const x = (m * x2 + n * x1) / (m + n)
      const y = (m * y2 + n * y1) / (m + n)

      console.log("Center ", i, " ", [x, y])
      centers.push([x, y])
    }
    centers.push(docCenter)
    console.assert(centers.length === numOfCenters, "Middle count got some errors")
    console.log("Examined Centers", centers)
    return centers
  }

  getScreenCenter(): Coordinates {
    const left = window.innerWidth / 2
    const top = window.innerHeight / 2
    return [left, top]
  }

  getDocumentCenter(): Coordinates {
    const html = document.documentElement
    const body = document.body
    const height = Math.max(body.scrollHeight, body.offsetHeight,
      html.clientHeight, html.scrollHeight, html.offsetHeight);
    const width = Math.max(body.scrollWidth, body.offsetWidth,
      html.clientWidth, html.scrollWidth, html.offsetWidth);

    const left = width / 2
    const top = height / 2
    return [left, top]
  }
}

export function createMarker(coordinates: Coordinates, color = "red", text = "marker"): HTMLElement {
  const marker = document.createElement("div")
  const textNode = document.createTextNode(text)
  marker.appendChild(textNode)
  marker.style.position = "absolute"
  $(marker).offset({ left: coordinates[0], top: coordinates[1] })
  $(marker).addClass("hyu-marker")
  document.body.appendChild(marker)

  const border = new Border(color, "5px")
  border.cover(marker)
  border.insert()
  return marker
}

export default CenterFenceExtractor