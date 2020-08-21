export interface ExtractorResult {
  extractorName: string
  title: string
  result: HTMLElement
  raw?: any
}

interface Extractor {
  name: string
  extract: (...args: any[]) => ExtractorResult | Promise<ExtractorResult>
}

export default Extractor