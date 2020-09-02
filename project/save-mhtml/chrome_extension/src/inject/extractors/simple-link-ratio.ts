import Extractor, { ExtractorResult } from './extractor'
import { elementTextPerLink } from './text-and-link'
import $ from 'jquery'

class SimpleLinkRatioExtractor implements Extractor {
  name = "simple-link-ratio"
  extractedElement = document.body
  report: ExtractorResult = {
    extractorName: this.name,
    title: "No Title",
    result: "",
    raw: {}
  }
  constructor() { }
  extract() {
    let maxLinkRatio = 0
    let maxLinkElement: HTMLElement = document.body
    $(document.body).each((index, elem) => {
      const report = elementTextPerLink(elem)
      if (maxLinkRatio < report.linkRatio) {
        console.log("MAX UP!", maxLinkRatio, "TO", report.linkRatio)
        maxLinkRatio = report.linkRatio
        maxLinkElement = elem
      }
    })
    this.extractedElement = maxLinkElement
    this.report = {
      extractorName: this.name,
      title: "RATIO",
      result: document.body.outerHTML,
    }

    return this.report
  }
}

export default SimpleLinkRatioExtractor