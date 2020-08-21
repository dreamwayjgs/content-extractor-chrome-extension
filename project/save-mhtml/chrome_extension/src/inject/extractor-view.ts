import AnswerOverlay from './overlay/answer'
import MozReadabilityExtractor from './extractors/mozilla-readability'
import CenterFenceExtractor from './extractors/center-fence'
import { ExtractorResult } from './extractors/extractor'


export function extractedAnswers(): ExtractorResult[] {
  const moz = new MozReadabilityExtractor()
  const mozExtraction = moz.extract()
  AnswerOverlay.drawAnswer(mozExtraction.result, moz.name)

  const centerFence = new CenterFenceExtractor()
  const centerFenceExtraction = centerFence.extract()
  AnswerOverlay.drawAnswer(centerFenceExtraction.result, centerFence.name)

  return [mozExtraction, centerFenceExtraction]
}