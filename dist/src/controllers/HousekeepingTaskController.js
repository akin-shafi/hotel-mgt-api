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
const HousekeepingTaskService_1 = require("../services/HousekeepingTaskService");
const housekeepingTaskService = new HousekeepingTaskService_1.HousekeepingTaskService();
class HousekeepingTaskController {
    createTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { description, roomId } = req.body;
            try {
                const task = yield housekeepingTaskService.createTask(description, roomId);
                res.status(201).json(task);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield housekeepingTaskService.getTasks();
                res.status(200).json(tasks);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    updateTaskStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, status } = req.body;
            try {
                const task = yield housekeepingTaskService.updateTaskStatus(id, status);
                res.status(200).json(task);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = new HousekeepingTaskController();
