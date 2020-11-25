import { timestampedLog, timestampedAssert } from '../modules/debugger'
import Article, { ArticleType, ArticlePath, CrawlLog } from '../entities/Article'
import { ExtractorResult } from '../inject/extractors/extractor'
import { EvaluationReport } from '../inject/evaluators/evaluator'


const endpoint = "http://127.0.0.1:53000"

export async function establish() {
  const body = await fetch(endpoint).then(res => res.json())
  if (body.status !== "success") {
    throw new Error("Cannot establish connection to server")
  }
  timestampedLog("Connection OK!")
  return true
}

export async function getArticles(from?: number, size?: number) {
  const url = new URL('articles', endpoint)
  const body = await fetch(url.toString()).then(res => res.json())
  return body
}

export async function getArticlesById(ids: number[]) {
  const url = new URL('article', endpoint)
  ids.forEach(id => {
    url.searchParams.append('id', id.toString())
  })
  const body = await fetch(url.toString()).then(res => res.json())
  return body
}

export async function getArticlesUrl(filter: ArticlePath, from?: number, size: number = 1): Promise<Article[]> {
  const target = (from !== undefined) ? `/articles${filter}?from=${from}&size=${size}` : `/articles${filter}`
  console.log(target, from)
  const body = await fetch(endpoint + target).then(res => res.json())
  const articles = body.map((x: ArticleType) => {
    const article = new Article(x.id, x.url)
    return article
  })
  return articles
}

export function getArticleFile(id: number) {
  const target = '/article/file'
  const url = `${endpoint}${target}?id=${id}`
  return url
}

export async function getArticleCheckedAnswer(aid: number) {
  const target = '/curation/answer'
  const url = `${endpoint}${target}?aid=${aid}`
  console.log("TO SERVER", url)
  const body = await fetch(url).then(res => res.json())
  return body
}

export function postArticle(data: CrawlLog) {
  timestampedAssert(data.stored, "POST", data)
  let formData = new FormData()
  for (const [key, value] of Object.entries<any>(data)) {
    if (typeof (value) === 'string' || value instanceof Blob) {
      formData.append(key, value)
    }
    else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value))
    }
    else {
      formData.append(key, value.toString())
    }
  }
  const url = new URL('article', endpoint)
  fetch(url.toString(), {
    method: "POST",
    body: formData
  }).then(res => {
    console.log("OK", res)
  }).catch(reason => {
    console.error(reason)
  })
}

export function postCenterValues(id: number, data: any) {
  timestampedLog("SEND plz", id, data)
  let formData = new FormData()
  formData.append('id', id.toString())
  formData.append('data', JSON.stringify(data))

  const target = "/article/center/values"
  fetch(endpoint + target, {
    method: "POST",
    body: formData
  }).then(res => {

  }).catch(reason => {
    console.log("POST Failed", reason)
  })
}

export function postNoContentAnswer(aid: number, uid: number) {
  let formData = new FormData()
  formData.append("aid", aid.toString())
  formData.append("uid", uid.toString())

  const target = "/extractor/invalid"
  fetch(endpoint + target, {
    method: "POST",
    body: formData
  }).then(res => {
    console.log("Answer Posted", res)
  }).catch(reason => {
    console.log("POST Failed", reason)
  })
}

export function postExtractorResult(id: number, result: ExtractorResult[] | [ExtractorResult[], EvaluationReport[]]) {
  let formData = new FormData()
  formData.append('id', id.toString())
  formData.append('result', JSON.stringify(result))
  console.log("SENDING", result)

  const target = "/extractor/result"
  fetch(endpoint + target, {
    method: "POST",
    body: formData
  }).then(res => {
    console.log("Extractor Report Posted", res)
  }).catch(reason => {
    console.log("POST Failed", reason)
  })
}