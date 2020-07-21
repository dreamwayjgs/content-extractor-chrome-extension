import { greet } from "./controller/hello"
import { getArticleAction, getArticlesAction, getFailedArticlesAction, postArticleAction } from "./controller/NaverArticle"
import { postFileAction } from "./controller/FileHandler"
import { getQueryBoardAction } from './controller/queryboard'

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
    method: "get",
    action: getArticleAction
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
  },
  {
    path: '/queryboard',
    method: 'get',
    action: getQueryBoardAction
  }
]