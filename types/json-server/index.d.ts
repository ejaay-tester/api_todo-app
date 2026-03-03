declare module "json-server" {
  import { Application, RequestHandler } from "express"

  interface JSONServer {
    create(): Application
    router(path: string): any
    defaults(): RequestHandler
  }

  const jsonServer: JSONServer
  export default jsonServer
}
