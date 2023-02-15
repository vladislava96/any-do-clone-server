import { PrismaClient } from '@prisma/client';
import { NextFunction, Response } from 'express';
import { Request } from './http';

export default class Authorization {
  public constructor(
    private readonly client: PrismaClient
  ) {
  }

  public createMiddleware() {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const key = req.header('Api-Key');

      if (key === undefined) {
        res.status(401).json({
          message: 'User is not authorized.'
        });

        return;
      }

      const session = await this.client.session.findFirst({
        where: { key }
      })

      if (session === null) {
        res.status(401).json({
          message: 'User is not authorized.'
        });

        return;
      }

      const user = await this.client.user.findFirst({
        where: { id: session.userId }
      });

      if (user === null) {
        res.status(401).json({
          message: 'User is not authorized.'
        });

        return;
      }

      req.key = key;
      req.session = session;
      req.user = user;

      next();
    }
  }
}
