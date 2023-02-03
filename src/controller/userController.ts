import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator/src/validation-result';

const client = new PrismaClient();

class UserController {

  async registration(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      throw new Error('Registration error');
    }
    const {email, password} = req.body;
    const user = await client.user.findFirst({where: {email}});
    if(user) {
      throw new Error('User already exist');
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const newUser = await client.user.create({
      data: {
        email,
        password: hashPassword
      }
    });
    res.json(newUser);
    res.status(201);
  }

  async login(req: Request, res: Response) {
    const {email, password} = req.body;
    const user = await client.user.findFirst({where: {email}});
    if(!user) {
      throw new Error('A user with this email address already exists.');
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) {
      throw new Error('Wrong password entered.');
    }
    res.json('Validation was successful! :)');
    res.status(201);
  }
}

const userController = new UserController();

export default userController;