import express from 'express';
import userRouter from './routes/userRouter';
import cors from 'cors';

const PORT = process.env.PORT || 8080;

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', userRouter)

app.listen(PORT, () => {console.log('server started http://localhost:8080')})
