export interface ArticleType {
  id: number
  url_origin: string
}

export type ArticlePath = "" | "/failed"

class Article implements ArticleType {
  id: number
  url_origin: string
  log?: string | JSON | Object

  constructor(id: number, url: string) {
    this.id = id
    this.url_origin = url
  }
}

export default Article