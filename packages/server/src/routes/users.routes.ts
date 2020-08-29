import { Router } from 'express'
import CreateUserService from '../services/CreateUserService'

// import ensureAuthentication from '../middlewares/ensureAuthentication'

const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body

  const createUser = new CreateUserService()

  const user = await createUser.execute({
    name,
    email,
    password
  })

  delete user.password

  return res.json(user)
})

export default usersRouter
