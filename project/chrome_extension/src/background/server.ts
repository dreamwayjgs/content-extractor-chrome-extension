import { timestampedLog, timestampedAssert } from '../modules/debugger'
import Article, { ArticleType, ArticlePath } from '../entities/Article'


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

export async function getArticlesById(ids: string[]) {
  const params: URLSearchParams = new URLSearchParams()
  ids.forEach(id => {
    params.append('id', id)
  })
  const target = '/article'
  const url = `${endpoint}${target}?${params.toString()}`
  const body = await fetch(url).then(res => res.json())
  return Article.fromArray(body)
}

export async function postArticle(id: number, log?: any, mhtml?: any, webpage?: any, subPath = "") {
  timestampedAssert(log.saved, "POST", log, mhtml)
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