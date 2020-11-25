import { greet } from "./controller/hello"
import { getArticleAction, getArticlesAction } from "./controller/ArticleCore"
import { getArticleMHtmlAction, postArticleAction } from "./controller/ArticleFile"
import { getCurationAnswerAction } from "./controller/ArticleCuration"
import { postExtractorResultAction } from "./controller/ArticleExtractor"

export const AppRoutes = [
  {
    path: "/",
    method: "get",
    action: greet
  },
  {
    path: "/article",
    method: "get",
    action: getArticleAction
  },
  {
    path: "/article",
    method: "post",
    action: postArticleAction
  },
  {
    path: "/articles",
    method: "get",
    action: getArticlesAction
  },
  {
    path: "/article/file",
    method: "get",
    action: getArticleMHtmlAction
  },
  {
    path: "/curation/answer",
    method: "get",
    action: getCurationAnswerAction
  },
  {
    path: "/extractor/result",
    method: "post",
    action: postExtractorResultAction
  }
]