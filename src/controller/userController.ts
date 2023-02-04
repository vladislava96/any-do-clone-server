import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

const client = new PrismaClient();
class UserController {

  async registration(req: Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation error.',
        errors
      });
      return;
    }
    const {name, email, password} = req.body;
    const user = await client.user.findFirst({where: {email}});
    if(user) {
      res.status(400).json({
        message: 'User with this email address already exists.'
      });
      return;
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const newUser = await client.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    });
    const responseUser = {
      id: newUser.id,
      name,
      email
    }
    res.json(responseUser);
    res.status(201);
  }

  async login(req: Request, res: Response) {
    const {email, password} = req.body;
    const user = await client.user.findFirst({where: {email}});
    if(!user) {
      res.status(400).json({
        message: 'User with this email address does not exist.'
      });
      return;
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword) {
      res.status(400).json({
        message: 'Wrong password entered.'
      });
      return;
    }
    const key = uuidv4();
    const newSession = await client.session.create({
      data: {
        key,
        userId: user.id
      }
    })
    res.json(newSession);
    res.status(200);
  }

  async logout(req: Request, res: Response) {
    const key = req.header('Api-Key');
    try {
      const session = await client.session.delete({where: {key}})
      res.json(session);
      res.status(200);
    } catch(err) {
      res.status(401).json({
        message: 'User is not authorized.'
      });
    }
  }
}

const userController = new UserController();

export default userController;