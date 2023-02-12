import express from 'express';
import userRouter from './routes/userRouter';
import quoteRouter from './routes/quoteRouter'
import cors from 'cors';

const PORT = process.env.PORT || 8080;

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', userRouter)
app.use('/api/quotes', quoteRouter)

app.listen(PORT, () => {console.log('server started http://localhost:8080')})
