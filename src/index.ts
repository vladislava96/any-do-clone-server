import express from 'express';
import UserRouter from './routes/UserRouter';
import QuoteRouter from './routes/QuoteRouter';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import ProjectRouter from './routes/ProjectRouter';
import Authorization from './Authorization';
import TaskRouter from './routes/TaskRouter';

const PORT = process.env.PORT || 8080;

const app = express();

const client = new PrismaClient();
const authorization = new Authorization(client);
const userRouterFactory = new UserRouter(client, authorization);
const projectRouterFactory = new ProjectRouter(client, authorization);
const taskRouterFactory = new TaskRouter(client, authorization);
const quoteRouterFactory = new QuoteRouter();

app.use(cors());
app.use(express.json());
app.use('/api', userRouterFactory.create());
app.use('/api', projectRouterFactory.create());
app.use('/api', quoteRouterFactory.create());
app.use('/api', taskRouterFactory.create());

app.listen(PORT, () => {console.log('server started http://localhost:8080')});
