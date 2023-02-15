import { PrismaClient } from '@prisma/client';
import express, { Response } from 'express';
import { Request } from '../http';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

export default class UserController {
  public constructor(
    private readonly client: PrismaClient,
  ) {
    this.registration = this.registration.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getUsers = this.getUsers.bind(this);
  }

  async registration(req: express.Request, res: Response) {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation error.',
        errors: errors.array()
      });
      return;
    }
    const {name, email, password} = req.body;
    const user = await this.client.user.findFirst({where: {email}});
    if(user) {
      res.status(400).json({
        message: 'User with this email address already exists.'
      });
      return;
    }
    const hashPassword = bcrypt.hashSync(password, 7);
    const newUser = await this.client.user.create({
      data: {
        name,
        email,
        password: hashPassword
      }
    });
    const response = {
      id: newUser.id,
      name,
      email
    }
    res.json(response);
    res.status(201);
  }

  async login(req: express.Request, res: Response) {
    const {email, password} = req.body;
    const user = await this.client.user.findFirst({where: {email}});
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
    const newSession = await this.client.session.create({
      data: {
        key,
        userId: user.id
      }
    })
    const response = {
      key: newSession.key,
      id: newSession.userId,
      name: user.name,
      email: user.email
    }
    res.json(response);
    res.status(200);
  }

  async logout(req: Request, res: Response) {
    try {
      const session = await this.client.session.delete({where: { key: req.key }})
      res.json(session);
      res.status(200);
    } catch(err) {
      res.status(401).json({
        message: 'User is not authorized.'
      });
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await this.client.user.findMany();
      const data = users.map(user => ({name: user.name, email: user.email}))
      res.json(data);
      res.status(200);
    } catch (err) {
      res.status(400).json({
        message: 'Bad request'
      })
    }
  }
}
