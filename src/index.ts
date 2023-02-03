import express from 'express';
import userRouter from './routes/userRouter';

const PORT = process.env.PORT || 8080;

const app = express()

app.use(express.json())
app.use('/api', userRouter)

app.listen(PORT, () => {console.log('server started http://localhost:8080')})
