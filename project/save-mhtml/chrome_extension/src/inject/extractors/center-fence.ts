import Extractor from "./extractor";
import $ from 'jquery'
import AnswerOverlay from "../overlay/answer";
import Boundary, { Coordinates, ZeroAreaElementException } from '../overlay/boundary'
import Border from "../overlay/border";
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
  dist: number[]
}


class CenterFenceExtractor implements Extractor {
  name = "center-fence"
  constructor() { }
  extract() {
    timestampedLog("Starting Extracts")
    let result = $("body")[0]

    const [possibles, centers] = this.closestElementsFromCenters()
    let data = {
      centerCoords: centers,
      reportOfCenters: new Array<any>()
    }
    possibles.forEach((item, index) => {
      timestampedLog("================Center " + index + " ============")
      AnswerOverlay.drawAnswer(item.elem, `Closest from ${index}`)

      const parents = this.parentDivs(item.elem)
      AnswerOverlay.drawAnswer(parents[0], `Distance From ${index}: ${item.dist[index].toString()}`)
      const reportEachCenter = {
        center: item,
        elements: new Array<any>()
      }
      parents.forEach((elem, index) => {
        timestampedLog("parent ", index, elem)
        const numOfAnchors = $("a", elem).length
        const text = $(elem).text()
        const singleWhiteSpaced = text.replace(/\s\s+/g, ' ')
        timestampedLog("ANCHOR", numOfAnchors)
        timestampedLog("TEXT", text.length, singleWhiteSpaced.length)
        timestampedLog("RATIO", singleWhiteSpaced.length / (1 + numOfAnchors))
        const report = {
          element: elem,
          numOfAnchors: numOfAnchors,
          originalTextLength: text.length,
          reducedTextLength: singleWhiteSpaced.length,
          linkRatio: singleWhiteSpaced.length / (1 + numOfAnchors)
        }
        reportEachCenter.elements.push(report)
      })
      data.reportOfCenters.push(reportEachCenter)
    })

    console.log("THIS IS RESULT", data)

    return {
      extractorName: this.name,
      title: "Not Found",
      result: result,
      raw: data
    }
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
          elem: <HTMLElement>elem,
          dist: distanceFromEachCenters
        }
      }
      catch (err) {
        return null
      }
    })
    const removedLineOrPoint: ElementWithDistances[] = elemsWithDistancesFromCenters.filter((el): el is ElementWithDistances => el !== null)
    console.log("LEN", elemsWithDistancesFromCenters.length, removedLineOrPoint.length)
    let closestItems: ElementWithDistances[] = Array(centers.length).fill(removedLineOrPoint[0])
    removedLineOrPoint.forEach(item => {
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

    const left = $(window).width()! / 2
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