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
exports.BookedRoom = void 0;
const typeorm_1 = require("typeorm");
const ReservationEntity_1 = require("./ReservationEntity");
const RoomEntity_1 = require("./RoomEntity");
let BookedRoom = class BookedRoom {
};
exports.BookedRoom = BookedRoom;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BookedRoom.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ReservationEntity_1.Reservation, (reservation) => reservation.bookedRooms, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'reservationId' }),
    __metadata("design:type", ReservationEntity_1.Reservation)
], BookedRoom.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => RoomEntity_1.Room, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'roomId' }),
    __metadata("design:type", RoomEntity_1.Room)
], BookedRoom.prototype, "room", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BookedRoom.prototype, "roomName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], BookedRoom.prototype, "numberOfAdults", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], BookedRoom.prototype, "numberOfChildren", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], BookedRoom.prototype, "roomPrice", void 0);
exports.BookedRoom = BookedRoom = __decorate([
    (0, typeorm_1.Entity)('booked_rooms')
], BookedRoom);
