import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import serve from 'koa-static'
import { AppRoutes } from './routes'

type RouteMethod = {
  [key: string]: Function
}

async function main() {
  const app = new Koa()
  const router = new Router()
  const routeMethod: RouteMethod = {
    post: router.post,
    get: router.get,
    put: router.put,
  }

  AppRoutes.forEach(route => routeMethod[route.method].call(router, route.path, route.action))

  app.use(koaBody({ multipart: true }))
  app.use(serve('static'))
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.listen(53000, "0.0.0.0")

  console.log("Koa running on 53000 to all hosts")
}

main()