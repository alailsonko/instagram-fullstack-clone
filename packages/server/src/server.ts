import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

app.get("/", (req: Request, res: Response ) => {
   

     res.status(200).json({ message: "hello world" })
})

app.listen(3333, () => {
    console.log("listening on port 3333");
    
})