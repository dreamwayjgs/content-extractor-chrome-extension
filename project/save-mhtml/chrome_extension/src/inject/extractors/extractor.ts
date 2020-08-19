interface ExtractorResult {
    title: string
    result: HTMLElement
}

interface Extractor {
    name: string
    extract: (...args: any[]) => ExtractorResult | Promise<ExtractorResult>
}

export default Extractor