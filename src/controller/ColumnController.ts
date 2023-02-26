import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request } from '../http';
import { validationResult } from 'express-validator';

export default class ColumnController {
  public constructor(
    private client: PrismaClient
  ) {
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    const columns = await this.client.column.findMany({
      where: { ownerId: req.user.id }
    });

    res.status(200).json(columns);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.columnId);
    const column = await this.client.column.findFirst({ where: { id } });

    if (column === null) {
      res.status(404).json({
        message: 'Column not found'
      });

      return;
    }

    if (column.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to column'
      });

      return;
    }

    res.status(200).json(column);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { title } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation error.',
        errors: errors.array()
      });
      return;
    }

    const column = await this.client.column.create({
      data: { 
        ownerId: req.user.id, 
        title,
        order: req.body.order,
      }
    })

    res.status(200).json(column);
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { title } = req.body;
    const id = Number(req.params.columnId);
    let column = await this.client.column.findFirst({ where: { id } });

    if (column === null) {
      res.status(404).json({
        message: 'Column not found'
      });

      return;
    }

    if (column.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to column'
      });

      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation error.',
        errors: errors.array()
      });
      return;
    }

    column = await this.client.column.update({
      data: { title, order: req.body.order },
      where: { id },
    });

    res.status(200).json(column);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.columnId);
    const column = await this.client.column.findFirst({ where: { id } });

    if (column === null) {
      res.status(404).json({
        message: 'Column not found'
      });

      return;
    }

    if (column.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to column'
      });

      return;
    }

    try {
      await this.client.column.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        message: 'Column not found'
      });
    }
  }
}
