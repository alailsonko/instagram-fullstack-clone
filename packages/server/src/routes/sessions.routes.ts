import { Router } from 'express'
import AuthenticationUserService from '../services/AuthenticationUserService'
const sessionsRouter = Router()

sessionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body

  const authenticationUser = new AuthenticationUserService()

  const { user, token } = await authenticationUser.execute({ email, password })

  delete user.password

  return res.json({ user, token })
})
export default sessionsRouter
