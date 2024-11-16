// src/services/HousekeepingTaskService.ts
import { AppDataSource } from '../data-source';
import { HousekeepingTask } from '../entities/HousekeepingTaskEntity';
import { Room } from '../entities/RoomEntity';

export class HousekeepingTaskService {
  private taskRepository = AppDataSource.getRepository(HousekeepingTask);
  private roomRepository = AppDataSource.getRepository(Room);

  async createTask(description: string, roomId: number) {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!room) throw new Error('Room not found');

    const task = this.taskRepository.create({ description, room });
    await this.taskRepository.save(task);
    return task;
  }

  async getTasks() {
    return await this.taskRepository.find({ relations: ['room'] });
  }

  async updateTaskStatus(id: number, status: string) {
    const task = await this.taskRepository.findOne({where: {id}});
    if (!task) throw new Error('Task not found');

    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
