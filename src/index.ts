import { PrismaClient } from '@prisma/client';
import express = require('express');

const PORT = process.env.PORT || 8080;
const client = new PrismaClient();

const app = express()
app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/users/create', async (req, res) => {
  const user = await client.user.create({
    data: {
      email: 'some@mail.ru',
      password: 'somepass',
    }
  })

  res.json(user);
})

app.listen(PORT, () => {console.log('server started http://localhost:8080')})
