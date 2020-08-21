import { timestampedLog } from '../modules/debugger'
import AnswerOverlay from './overlay/answer'
import Boundary from './overlay/boundary'
import CenterFenceExtractor, { createMarker } from './extractors/center-fence'
import { extractedAnswers } from './extractor-view'
import { ExtractorResult } from './extractors/extractor'


export function curation(answerData: any[]): ExtractorResult[] | null {
  timestampedLog("Running in ", parent.frames.length)
  curationAnswer(answerData)
  return extractedAnswers()
  // examineAnswer(answerData[0]) // TODO: What answer would be chosen?
}

function curationAnswer(answerData: any[]) {
  timestampedLog(answerData)
  answerData.forEach((answer: any) => {
    const cssSelector = answer["css_selector"]
    const mainContent: HTMLElement | null = <HTMLElement>document.querySelector(cssSelector)
    timestampedLog("mc ", mainContent)
    if (mainContent !== null) {
      AnswerOverlay.drawAnswer(mainContent, answer["name"])
    }
    else {
      timestampedLog("You have null.. send this target")
      chrome.runtime.sendMessage({
        info: "curation-no-main-content",
        message: "No Main Content",
        answer: answer
      })
    }
  })
}

function examineAnswer(answer: any) {
  timestampedLog("EXAMINE")
  const cssSelector = answer["css_selector"]
  const mainContent: HTMLElement | null = <HTMLElement>document.querySelector(cssSelector)
  if (mainContent === null) {
    timestampedLog("NO ANSWER", answer)
    return;
  }

  const mainContentBoundary = new Boundary(mainContent)
  const centerFence = new CenterFenceExtractor()
  const coordinates = centerFence.examineCenters()
  const overlaps: Boolean[] = []
  for (let coord of coordinates) {
    const boundary = new Boundary(createMarker(coord))
    overlaps.push(mainContentBoundary.isOverlapped(boundary))
  }
  timestampedLog("COORDS", coordinates)
  timestampedLog("OVERLAPS", overlaps)
  const result = {
    "coords": coordinates,
    "overlaps": overlaps
  }

  chrome.runtime.sendMessage({
    command: "request-center-statistics",
    data: result,
    aid: answer.aid
  })
}