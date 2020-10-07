import { findCommonItems } from './lcs'
import Boundary from '../overlay/boundary'
import { Answer } from '../overlay/answer'
import Extractor from '../extractors/extractor'
import { tokenize } from 'string-punctuation-tokenizer'


export type EvaluationReport = any

export function evaluate(answer: Answer, evaluatees: Extractor[]): EvaluationReport[] {
  console.log("EVAULATION ON", answer)
  const reports = []
  reports.push(evaluatees.map(evaluatee => (
    {
      report: lcsOnElements(answer.elem, evaluatee.extractedElement),
      answer: answer.name,
      evaluatee: evaluatee.name,
      description: "LCS Evaluation on raw HTML and Text"
    }
  )))
  reports.push(evaluatees.map(evaluatee => (
    {
      report: lcsOnElements(answer.elem, evaluatee.extractedElement, true),
      answer: answer.name,
      evaluatee: evaluatee.name,
      description: "LCS Evaluation on HTML and Text reduced whitespaces"
    }
  )))
  reports.push(evaluatees.map(evaluatee => (
    {
      report: iouF1Report(answer.elem, evaluatee.extractedElement),
      answer: answer.name,
      evaluatee: evaluatee.name,
      description: "IoU Evaluation"
    }
  )))
  reports.push(evaluatees.map(evaluatee => (
    {
      report: wordTokenReport(answer.elem, evaluatee.extractedElement),
      answer: answer.name,
      evaluatee: evaluatee.name,
      description: "word token test"
    }
  )))

  console.log("EVAL REPORT RETURN: ", reports)
  return reports
}

function lcsOnElements(relevant: HTMLElement, retrieved: HTMLElement, reducedWhiteSpaces = false) {
  const scoringHTML = lcsF1Report(relevant.outerHTML, retrieved.outerHTML, reducedWhiteSpaces, 'html')
  const relevantText = relevant.textContent
  const retrievedText = retrieved.textContent
  if (relevantText === null || retrievedText === null) {
    return [scoringHTML, "NOTEXT"]
    // return {
    //   subReports: [scoringHTML, "NOTEXT"]
    // }
  }
  else {
    const scoringText = lcsF1Report(relevantText, retrievedText, reducedWhiteSpaces)
    return [scoringHTML, scoringText]
    // return {
    //   subReports: [scoringHTML, scoringText]
    // }
  }
}

function lcsF1Report(relevant: string, retrieved: string, reducedWhiteSpaces = false, textType = "text") {
  const text1: string = reducedWhiteSpaces ? relevant.replace(/\s\s+/g, ' ') : relevant
  const text2 = reducedWhiteSpaces ? retrieved.replace(/\s\s+/g, ' ') : retrieved
  const lcs = findCommonItems(text1, text2)
  const precision = lcs.length / text2.length
  const recall = lcs.length / text1.length
  const f1 = (2 * precision * recall) / (precision + recall)
  const report = {
    "mode": "lcs",
    "option": {
      "reducedWhiteSpaces": reducedWhiteSpaces,
      "textType": textType
    },
    "relevantLength": text1.length,
    "retrievedLength": text2.length,
    "precision": precision,
    "recall": recall,
    "f1": f1
  }
  return report
}

export function wordTokenReport(relevant: string | HTMLElement, retrieved: string | HTMLElement) {
  const wordVector1: string = tokenize({ text: relevant instanceof HTMLElement ? relevant.textContent : relevant })
  const wordVector2: string = tokenize({ text: retrieved instanceof HTMLElement ? retrieved.textContent : retrieved })
  const wordSet1 = new Set(wordVector1)
  const wordSet2 = new Set(wordVector2)
  const intersection = new Set<string>(Array.from(wordSet1).filter(x => wordSet2.has(x)));
  const precision = intersection.size / wordSet2.size
  const recall = intersection.size / wordSet1.size
  const f1 = (2 * precision * recall) / (precision + recall)
  const report = {
    "mode": "Word Token Set",
    "relevantLength": wordSet1.size,
    "retrievedLength": wordSet2.size,
    "precision": precision,
    "recall": recall,
    "f1": f1
  }
  return report

}

export function iouF1Report(relevant: HTMLElement, retrieved: HTMLElement) {
  const box1 = new Boundary(relevant)
  const box2 = new Boundary(retrieved)
  const x1 = Math.max(box1.left, box2.left)
  const y1 = Math.max(box1.top, box2.top)
  const x2 = Math.min(box1.right, box2.right)
  const y2 = Math.min(box1.bottom, box2.bottom)

  const areaIntersection = (x2 - x1) * (y2 - y1)
  const areaBox1 = box1.width * box1.height
  const areaBox2 = box2.width * box2.height
  console.assert(areaBox1 * areaBox2 !== 0, "Element Has No Area", relevant, retrieved)
  const areaUnion = areaBox1 + areaBox2 - areaIntersection

  const report = {
    "mode": "iou",
    "relevant": {
      "rect": box1.rect,
      "area": areaBox1
    },
    "retrieved": {
      "rect": box2.rect,
      "area": areaBox2
    },
    "intersection": [[x1, y1], [x2, y2]],
    "values": [areaIntersection, areaUnion],
    "iou": box1.isOverlapped(box2) ? areaIntersection / areaUnion : 0
  }
  return report
}