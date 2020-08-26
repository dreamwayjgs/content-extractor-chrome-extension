import AnswerOverlay from './overlay/answer'
import MozReadabilityExtractor from './extractors/mozilla-readability'
import CenterFenceExtractor from './extractors/center-fence'
import { ExtractorResult } from './extractors/extractor'


export function extractedAnswers(): ExtractorResult[] {
  const moz = new MozReadabilityExtractor()
  const mozExtraction = moz.extract()
  AnswerOverlay.drawAnswer(moz.extractedElement, moz.name)

  const centerFence = new CenterFenceExtractor()
  const centerFenceExtraction = centerFence.extract()
  AnswerOverlay.drawAnswer(centerFence.extractedElement, centerFence.name)

  return [mozExtraction, centerFenceExtraction]
}