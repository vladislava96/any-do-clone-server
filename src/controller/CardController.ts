import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request } from '../http';
import { validationResult } from 'express-validator';

export default class CardController {
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
    let columnIds: number[] = [];

    if (req.query.columnId) {
      const columnId = Number(req.query.columnId);
      const column = await this.client.column.findFirst({ where: { id: columnId } });
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

      columnIds = [columnId];
    } else {
      const columns = await this.client.column.findMany({
        where: { ownerId: req.user.id }
      });

      columnIds = columns.map(column => column.id);
    }

    const cards = await this.client.card.findMany({
      where: { columnId: { in: columnIds } }
    })

    res.status(200).json(cards);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const cardId = Number(req.params.cardId);
    const card = await this.client.card.findFirst({ where: { id: cardId } })

    if (card === null) {
      res.status(404).json({
        message: 'Card not found'
      })

      return;
    }

    const column = await this.client.column.findFirst({ where: { id: card.columnId } })

    if (column.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to card'
      });

      return;
    }

    res.status(200).json(card)
  }

  public async create(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation error.',
        errors: errors.array()
      });

      return;
    }

    let columnId = null;
    if (req.body.columnId) {
      columnId = Number(req.body.columnId);
      const column = await this.client.column.findFirst({ where: { id: columnId } });

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
    }

    const card = await this.client.card.create({
      data: {
        columnId,
        title: req.body.title,
        description: req.body.description,
        participant: req.body.participant,
        order: req.body.order,
      }
    })

    res.status(201).json(card)
  }

  public async update(req: Request, res: Response): Promise<void> {
    const cardId = Number(req.params.cardId);
    let card = await this.client.card.findFirst({ where: { id: cardId } })
    if (card === null) {
      res.status(404).json({
        message: 'Card not found'
      })

      return;
    }

    const column = await this.client.column.findFirst({ where: { id: card.columnId } })

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

    if (column.id !== card.columnId) {
      res.status(403).json({
        message: 'No access to card'
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

    card = await this.client.card.update({
      data: {
        columnId: req.body.columnId,
        title: req.body.title,
        description: req.body.description ?? null,
        participant: req.body.participant ?? null,
        order: req.body.order
      }, where: { id: cardId }
    });

    res.status(200).json(card)
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const cardId = Number(req.params.cardId);
    const card = await this.client.card.findFirst({ where: { id: cardId } })

    if (card === null) {
      res.status(404).json({
        message: 'Card not found'
      })

      return;
    }

    const column = await this.client.column.findFirst({ where: { id: card.columnId } })

    if (column.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to column'
      });

      return;
    }

    try {
      await this.client.card.delete({ where: { id: cardId } });

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        message: 'Card not found'
      });
    }
  }
}
