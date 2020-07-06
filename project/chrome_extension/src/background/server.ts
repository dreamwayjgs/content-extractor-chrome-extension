import { timestampedLog } from '../modules/debugger'
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

export async function getArticlesUrl(filter: ArticlePath, from?: number, size?: number): Promise<Article[]> {
  const target = (from !== undefined) ? `/articles${filter}?from=${from}&size=${size}` : `/articles${filter}`
  console.log(target, from)
  const body = await fetch(endpoint + target).then(res => res.json())
  const urls = body.map((x: ArticleType) => {
    const article = new Article(x.id, x.url_origin)
    return article
  })
  return urls
}

export async function postArticle(id: number, log?: any, mhtml?: any, subPath = "") {
  timestampedLog("POST", log, mhtml)
  let formData = new FormData()
  formData.append('id', id.toString())
  formData.append('log', JSON.stringify(log))
  if (mhtml) formData.append('mhtml', mhtml);

  timestampedLog("POST", formData.getAll('log'))
  const target = "/article" + subPath
  fetch(endpoint + target, {
    method: "POST",
    body: formData
  }).then(res => {
    console.log("POST Success")
  }).catch(reason => {
    console.log("POST Failed")
  })
}