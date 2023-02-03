import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const client = new PrismaClient();

class UserController {

  async registration(req: Request, res: Response) {
    try {
      const {email, password} = req.body;
      const person = await client.user.findFirst({where: {email}})

      if(person) {
        throw new Error('user already exist')
      }

      const newPerson = await client.user.create({
        data: {
          email,
          password
        }
      });
      res.json(newPerson);
      res.status(201);

    } catch (e) {
      console.log(e)
      res.status(400).json({message: 'Registration error'})
    }
  }

}

const userController = new UserController();

export default userController;