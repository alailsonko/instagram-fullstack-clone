import { Router } from 'express'
import authRouters from './auth'

const routes = Router()

const routesHandler = [authRouters]

for (const rt of routesHandler) {
  routes.use('/api/v1', rt)
}

export default routes