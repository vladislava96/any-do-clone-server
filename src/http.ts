import { Session, User } from '@prisma/client';

import express from 'express';

export interface Request extends express.Request {
  key: string;
  session: Session;
  user: User;
}
