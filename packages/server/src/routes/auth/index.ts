import {Request, Response, Router} from 'express'

const route = Router()

route.post('/signup', (req: Request, res: Response) => {
    console.log(req.body)
    return res.status(200).json({'msg': 'working'})
})


export default route