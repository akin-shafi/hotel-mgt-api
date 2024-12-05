"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HousekeepingTask = void 0;
// src/entities/HousekeepingTaskEntity.ts
const typeorm_1 = require("typeorm");
const RoomEntity_1 = require("./RoomEntity");
let HousekeepingTask = class HousekeepingTask {
};
exports.HousekeepingTask = HousekeepingTask;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HousekeepingTask.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HousekeepingTask.prototype, "hotelId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], HousekeepingTask.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], HousekeepingTask.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RoomEntity_1.Room, { onDelete: 'SET NULL' }),
    __metadata("design:type", RoomEntity_1.Room)
], HousekeepingTask.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HousekeepingTask.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HousekeepingTask.prototype, "updatedAt", void 0);
exports.HousekeepingTask = HousekeepingTask = __decorate([
    (0, typeorm_1.Entity)()
], HousekeepingTask);
