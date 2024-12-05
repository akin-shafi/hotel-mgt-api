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
exports.RoomType = void 0;
// src/entities/RoomEntity.ts
const typeorm_1 = require("typeorm");
const HotelEnitity_1 = require("./HotelEnitity");
let RoomType = class RoomType {
};
exports.RoomType = RoomType;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoomType.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomType.prototype, "roomType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoomType.prototype, "numRooms", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomType.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoomType.prototype, "pricePerNight", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], RoomType.prototype, "isAvailable", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'clean' }),
    __metadata("design:type", String)
], RoomType.prototype, "maintenanceStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], RoomType.prototype, "amenities", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HotelEnitity_1.Hotel, (hotel) => hotel.rooms),
    (0, typeorm_1.JoinColumn)({ name: 'hotelId' }) // Corrected 'tenantId' to 'hotelId'
    ,
    __metadata("design:type", HotelEnitity_1.Hotel)
], RoomType.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomType.prototype, "hotelId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoomType.prototype, "tenantId", void 0);
exports.RoomType = RoomType = __decorate([
    (0, typeorm_1.Entity)()
], RoomType);
