export interface ExtractorResult {
  extractorName: string
  title: string
  result: string
  raw?: any
}

interface Extractor {
  name: string
  extractedElement: HTMLElement
  report: ExtractorResult
  extract: (...args: any[]) => ExtractorResult | Promise<ExtractorResult>
}

export default Extractor