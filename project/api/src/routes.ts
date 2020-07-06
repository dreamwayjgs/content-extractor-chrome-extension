import { greet } from "./controller/hello"
import { getArticlesAction, getFailedArticlesAction, postArticleAction } from "./controller/NaverArticle"
import { postFileAction } from "./controller/FileHandler"

export const AppRoutes = [
  {
    path: "/",
    method: "get",
    action: greet
  },
  {
    path: "/articles",
    method: "get",
    action: getArticlesAction
  },
  {
    path: "/articles/failed",
    method: "get",
    action: getFailedArticlesAction
  },
  {
    path: "/article",
    method: "post",
    action: postArticleAction
  },
  {
    path: '/article/upload',
    method: 'post',
    action: postFileAction
  }
]