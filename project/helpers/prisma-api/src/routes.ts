import { greet } from "./controller/hello"
import { getArticleAction, getArticlesAction } from "./controller/NaverArticleCore"
import { getArticleMHtmlAction, postArticleAction } from "./controller/NaverArticleFile"

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
]