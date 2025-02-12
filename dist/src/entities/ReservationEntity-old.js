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
exports.ReservationStatus = exports.Reservation = void 0;
const typeorm_1 = require("typeorm");
const BillingEntity_1 = require("./BillingEntity"); // Import Billing entity
const HotelEntity_1 = require("./HotelEntity"); // Import Hotel entity
const GuestEntity_1 = require("./GuestEntity"); // Import Guest entity
const constants_1 = require("../constants");
Object.defineProperty(exports, "ReservationStatus", { enumerable: true, get: function () { return constants_1.ReservationStatus; } });
let Reservation = class Reservation {
};
exports.Reservation = Reservation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reservation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GuestEntity_1.Guest, (guest) => guest.reservations, { nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'guestId' }),
    __metadata("design:type", GuestEntity_1.Guest)
], Reservation.prototype, "guest", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Reservation.prototype, "adults", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Reservation.prototype, "children", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "roomName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "beds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Reservation.prototype, "checkInDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Reservation.prototype, "checkOutDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.ReservationType }),
    __metadata("design:type", String)
], Reservation.prototype, "reservationType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.ReservationStatus }),
    __metadata("design:type", String)
], Reservation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: constants_1.ActivityType })
    // @Column({ nullable: true })
    ,
    __metadata("design:type", String)
], Reservation.prototype, "activity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Reservation.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Reservation.prototype, "confirmed", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => BillingEntity_1.Billing, (billing) => billing.reservation),
    __metadata("design:type", Array)
], Reservation.prototype, "billing", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => HotelEntity_1.Hotel, (hotel) => hotel.reservations, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'hotelId' }),
    __metadata("design:type", HotelEntity_1.Hotel)
], Reservation.prototype, "hotel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Reservation.prototype, "hotelId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Reservation.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, nullable: true }),
    __metadata("design:type", Array)
], Reservation.prototype, "specialRequest", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Reservation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Reservation.prototype, "confirmedDate", void 0);
exports.Reservation = Reservation = __decorate([
    (0, typeorm_1.Entity)('reservations')
], Reservation);
