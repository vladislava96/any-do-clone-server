import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request } from '../http';
import { validationResult } from 'express-validator';

export default class TaskController {
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
    let projectId: number | undefined = undefined;
    if (req.query.projectId) {
      projectId = Number(req.query.projectId);
      const project = await this.client.project.findFirst({ where: { id: Number(projectId) }});
      if (project === null) {
        res.status(404).json({
          message: 'Project no found'
        });

        return;
      }

      if (project.ownerId !== req.user.id) {
        res.status(403).json({
          message: 'No access to project'
        });

        return;
      }
    }

    const tasks = await this.client.task.findMany({
      where: {
        projectId,
        ownerId: req.user.id,
      }
    })

    res.status(200).json(tasks);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const taskId = Number(req.params.taskId);
    const task = await this.client.task.findFirst({ where: { id: taskId } })

    if (task === null) {
      res.status(404).json({
        message: 'Task not found'
      })

      return;
    }

    if (task.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to task'
      });

      return;
    }

    res.status(200).json(task)
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

    let projectId = null;
    if (req.body.projectId) {
      projectId = Number(req.body.projectId);
      const project = await this.client.project.findFirst({ where: { id: projectId } });

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
    }

    const task = await this.client.task.create({
      data: {
        ownerId: req.user.id,
        projectId,
        status: req.body.status,
        performDate: new Date(req.body.performDate),
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag
      }
    })

    res.status(201).json(task)
  }

  public async update(req: Request, res: Response): Promise<void> {
    const taskId = Number(req.params.taskId);
    let task = await this.client.task.findFirst({ where: { id: taskId } })
    if (task === null) {
      res.status(404).json({
        message: 'Task not found'
      })

      return;
    }

    if (task.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to task'
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

    let projectId = null;
    if (req.body.projectId) {
      projectId = Number(req.body.projectId);
      const project = await this.client.project.findFirst({ where: { id: projectId } });
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
    }

    task = await this.client.task.update({
      data: {
        projectId,
        status: req.body.status,
        performDate: new Date(req.body.performDate),
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag
      }, where: { id: taskId }
    });

    res.status(200).json(task)
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const taskId = Number(req.params.taskId);
    const task = await this.client.task.findFirst({ where: { id: taskId } })

    if (task === null) {
      res.status(404).json({
        message: 'Task not found'
      })

      return;
    }

    if (task.ownerId !== req.user.id) {
      res.status(403).json({
        message: 'No access to project'
      });

      return;
    }

    try {
      await this.client.task.delete({ where: { id: taskId } });

      res.status(204).send();
    } catch (error) {
      res.status(404).json({
        message: 'Task not found'
      });
    }
  }
}
