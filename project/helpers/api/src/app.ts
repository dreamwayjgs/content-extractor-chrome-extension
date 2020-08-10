import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import serve from 'koa-static'
import { AppRoutes } from './routes'

type RouteMethod = {
  [key: string]: Function
}

const app = new Koa()
const router = new Router()
const routeMethod: RouteMethod = {
  post: router.post,
  get: router.get,
  put: router.put,
}

AppRoutes.forEach(route => routeMethod[route.method].call(router, route.path, route.action))

console.log("Active Routes")
AppRoutes.forEach(appRoute => {
  console.log(appRoute.path, appRoute.method)
})

app.use(koaBody({ multipart: true }))
app.use(serve('static'))
app.use(router.routes())
app.use(router.allowedMethods())

export default app

