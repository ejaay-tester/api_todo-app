import { Request, Response, NextFunction } from "express"

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now()

  res.on("finish", () => {
    const duration = Date.now() - start
    const status = res.statusCode

    const log = {
      timeStamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status,
      duration: `${duration}ms`,
      ip: req.ip,
    }

    // Color code based on status
    const color =
      status >= 500 ? "🔴" : status >= 400 ? "🟡" : status >= 300 ? "🔵" : "🟢"

    console.log(
      `${color} [${log.timeStamp}] STATUS ${log.status} - ${log.method} ${log.path} (${log.duration})`,
    )
  })

  next()
}
