import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request } from '../http';
import { validationResult } from 'express-validator';

export default class ProjectController {
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
    const projects = await this.client.project.findMany({
      where: { ownerId: req.user.id }
    });

    res.status(200).json(projects);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.projectId);
    const project = await this.client.project.findFirst({ where: { id } });

    if (project === null) {
      res.status(404).json({
        message: 'Project not found'
      });

      return;
    }

    res.status(200).json(project);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: 'Validation error.',
        errors: errors.array()
      });
      return;
    }

    const project = await this.client.project.create({
      data: { ownerId: req.user.id, name }
    })

    res.status(200).json(project);
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    const id = Number(req.params.projectId);
    let project = await this.client.project.findFirst({ where: { id } });

    if (project === null) {
      res.status(404).json({
        message: 'Project not found'
      });

      return;
    }

    if (project.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to project'
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

    project = await this.client.project.update({
      data: { name },
      where: { id },
    });

    res.status(200).json(project);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.projectId);
    const project = await this.client.project.findFirst({ where: { id } });

    if (project === null) {
      res.status(404).json({
        message: 'Project not found'
      });

      return;
    }

    if (project.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to project'
      });

      return;
    }

    try {
      await this.client.project.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        message: 'Project not found'
      });
    }
  }
}
