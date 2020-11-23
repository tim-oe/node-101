import express, { Request, Response } from 'express';

const app = express()
const port = 8080

app.get('/', (req: Request, res: Response) => {
  res.send('Hello! ' + req.ip)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})