import AnswerOverlay from './overlay/answer'
import MozReadabilityExtractor from './extractors/mozilla-readability'
import CenterFenceExtractor from './extractors/center-fence'


export function extractedAnswers() {
  const moz = new MozReadabilityExtractor()
  AnswerOverlay.drawAnswer(moz.extract().result, moz.name)
  const centerFence = new CenterFenceExtractor()
  const centerFenceResult = centerFence.extract()
  AnswerOverlay.drawAnswer(centerFenceResult.result, centerFence.name)
}