import AnswerOverlay from './overlay/answer'
import MozReadabilityExtractor from './extractors/mozilla-readability'
import CenterFenceExtractor from './extractors/center-fence'
import SimpleLinkRatioExtractor from './extractors/simple-link-ratio'
import Extractor from './extractors/extractor'


export function runExtractors(): Extractor[] {
  const moz = new MozReadabilityExtractor()
  const mozExtraction = moz.extract()
  AnswerOverlay.drawAnswer(moz.extractedElement, moz.name)

  const centerFence = new CenterFenceExtractor()
  const centerFenceExtraction = centerFence.extract()
  AnswerOverlay.drawAnswer(centerFence.extractedElement, centerFence.name)

  const simpleLink = new SimpleLinkRatioExtractor()
  const simpleLinkExtraction = simpleLink.extract()
  AnswerOverlay.drawAnswer(simpleLink.extractedElement, simpleLink.name)

  return [moz, centerFence]
}