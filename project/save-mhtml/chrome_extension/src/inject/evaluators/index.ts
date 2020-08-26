import { findCommonItems } from './lcs'

function evaluate(elemA: HTMLElement, elemB: HTMLElement) {
  const lcs = findCommonItems(elemA.outerHTML, elemB.outerHTML)
  return lcs
}

export default evaluate