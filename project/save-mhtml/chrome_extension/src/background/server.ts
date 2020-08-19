import { timestampedLog, timestampedAssert } from '../modules/debugger'
import Article, { ArticleType, ArticlePath, AnsweredArticle } from '../entities/Article'


const endpoint = "http://127.0.0.1:53000"

export async function establish() {
  const body = await fetch(endpoint).then(res => res.json())
  if (body.status !== "success") {
    throw new Error("Cannot establish connection to server")
  }
  timestampedLog("Connection OK!")
  return true
}

export async function getArticlesUrl(filter: ArticlePath, from?: number, size: number = 1): Promise<Article[]> {
  const target = (from !== undefined) ? `/articles${filter}?from=${from}&size=${size}` : `/articles${filter}`
  console.log(target, from)
  const body = await fetch(endpoint + target).then(res => res.json())
  const articles = body.map((x: ArticleType) => {
    const article = new Article(x.id, x.url_origin)
    return article
  })
  return articles
}

export async function getArticlesById(ids: number[]) {
  const params: URLSearchParams = new URLSearchParams()
  ids.forEach(id => {
    params.append('id', id.toString())
  })
  const target = '/article'
  const url = `${endpoint}${target}?${params.toString()}`
  const body = await fetch(url).then(res => res.json())
  return Article.fromArray(body)
}

export function getArticleFile(id: number) {
  const target = '/article/file'
  const url = `${endpoint}${target}?id=${id}`
  return url
}

export async function getArticleCheckedAnswer(aid: number) {
  const target = '/article/answer'
  const url = `${endpoint}${target}?aid=${aid}`
  const body = await fetch(url).then(res => res.json())
  return body
}

export function postArticle(id: number, log?: any, mhtml?: any, webpage?: any, subPath = "") {
  timestampedAssert(log.saved, "POST", id, log, mhtml)
  let formData = new FormData()
  formData.append('id', id.toString())
  formData.append('log', JSON.stringify(log))
  if (mhtml) formData.append('mhtml', mhtml);
  if (webpage) formData.append('webpage', JSON.stringify(webpage));

  const target = "/article" + subPath
  fetch(endpoint + target, {
    method: "POST",
    body: formData
  }).then(res => {

  }).catch(reason => {
    console.log("POST Failed")
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
    console.log("POST Failed")
  })
}

export function postNoContentAnswer(aid: number, uid: number) {
  let formData = new FormData()
  formData.append("aid", aid.toString())
  formData.append("uid", uid.toString())

  const target = "/answer/invalid"
  fetch(endpoint + target, {
    method: "POST",
    body: formData
  }).then(res => {
    console.log("Answer Posted")
  }).catch(reason => {
    console.log("POST Failed")
  })
}