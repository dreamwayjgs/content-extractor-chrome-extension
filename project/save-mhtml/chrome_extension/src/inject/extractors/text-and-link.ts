import $ from 'jquery'

export function elementTextPerLink(elem: HTMLElement) {
  const numOfAnchors = $("a", elem).length
  const text = elem.textContent ?? ""
  const singleWhiteSpaced = text.replace(/\s\s+/g, ' ')
  console.log("RATIO", singleWhiteSpaced.length / (1 + numOfAnchors))
  const report = {
    element: elem.outerHTML,
    numOfAnchors: numOfAnchors,
    originalTextLength: text.length,
    reducedTextLength: singleWhiteSpaced.length,
    linkRatio: singleWhiteSpaced.length / (1 + numOfAnchors)
  }
  return report
}