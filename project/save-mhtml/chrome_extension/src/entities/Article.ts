import { getArticleCheckedAnswer } from "../background/server"
import { timestampedAssert, timestampedLog } from "../modules/debugger"

export interface ArticleType {
  id: number
  url_origin: string
}

export type ArticlePath = "" | "/failed"

class Article implements ArticleType {
  id: number
  url_origin: string
  log?: string | JSON | Object
  filename?: string

  constructor(id: number, url: string) {
    this.id = id
    this.url_origin = url
  }

  static fromArray(body: any[]) {
    const articles = body.map((x: ArticleType) => {
      const article = new Article(x.id, x.url_origin)
      return article
    })
    return articles
  }
}

/*
    "div_tag_attrs": "id=\"main_content\";class=\"content\"",
        "div_xpath": "/html/body/div[2]/table/tbody/tr/td[1]/div",
        "css_selector": "#main_content",
        "nav_xpath": "/html/body/div[2]/div[3]/div[3]",
        "nav_selector": "#header > div.lnb_area"
        */

type NO_ANSWER = "_NO_ANSWER"

export class AnsweredArticle extends Article {
  answers?: Answer | NO_ANSWER
  constructor(id: number, url: string) {
    super(id, url)
    getArticleCheckedAnswer(id).then(body => {
      timestampedLog(body)
    })
  }
}

class Answer {
  divTagAttrs: string[]
  cssSelector: string
  navXpath: string
  navSelector: string
  constructor(divTagAttrs: string[], cssSelector: string, navXpath: string, navSelector: string) {
    this.divTagAttrs = divTagAttrs
    this.cssSelector = cssSelector
    this.navXpath = navXpath
    this.navSelector = navSelector
  }
  static parseAnswer(answerData: any) {

  }
}

export default Article