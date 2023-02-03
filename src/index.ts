import express, { Request, Response } from 'express';
import userRouter from './routes/userRouter';

const PORT = process.env.PORT || 8080;

const app = express()

app.use(express.json())
app.use('/api', userRouter)
app.use(errorHandler);

function errorHandler(err: Error, req: Request, res: Response): void {
  console.log(err);
  res.status(400).json({message: err.message});
}

app.listen(PORT, () => {console.log('server started http://localhost:8080')})
