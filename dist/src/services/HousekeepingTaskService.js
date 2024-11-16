"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousekeepingTaskService = void 0;
// src/services/HousekeepingTaskService.ts
const data_source_1 = require("../data-source");
const HousekeepingTaskEntity_1 = require("../entities/HousekeepingTaskEntity");
const RoomEntity_1 = require("../entities/RoomEntity");
class HousekeepingTaskService {
    constructor() {
        this.taskRepository = data_source_1.AppDataSource.getRepository(HousekeepingTaskEntity_1.HousekeepingTask);
        this.roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
    }
    createTask(description, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = yield this.roomRepository.findOne({ where: { id: roomId } });
            if (!room)
                throw new Error('Room not found');
            const task = this.taskRepository.create({ description, room });
            yield this.taskRepository.save(task);
            return task;
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.taskRepository.find({ relations: ['room'] });
        });
    }
    updateTaskStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findOne({ where: { id } });
            if (!task)
                throw new Error('Task not found');
            task.status = status;
            yield this.taskRepository.save(task);
            return task;
        });
    }
}
exports.HousekeepingTaskService = HousekeepingTaskService;
