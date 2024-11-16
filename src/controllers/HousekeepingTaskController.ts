// src/controllers/HousekeepingTaskController.ts
import { Request, Response } from 'express';
import { HousekeepingTaskService } from '../services/HousekeepingTaskService';

const housekeepingTaskService = new HousekeepingTaskService();


class HousekeepingTaskController {

  async createTask(req: Request, res: Response) {
    const { description, roomId } = req.body;

    try {
      const task = await housekeepingTaskService.createTask(description, roomId);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTasks(req: Request, res: Response) {
    try {
      const tasks = await housekeepingTaskService.getTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateTaskStatus(req: Request, res: Response) {
    const { id, status } = req.body;
    try {
      const task = await housekeepingTaskService.updateTaskStatus(id, status);
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

export default new HousekeepingTaskController();


