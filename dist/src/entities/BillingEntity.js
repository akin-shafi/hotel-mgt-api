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
exports.Billing = exports.PaymentMethod = exports.BillingStatus = void 0;
const typeorm_1 = require("typeorm");
const ReservationEntity_1 = require("./ReservationEntity");
// Enum for the billing status
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["UNPAID"] = "unpaid";
    BillingStatus["PAID"] = "paid";
    BillingStatus["REFUNDED"] = "refunded";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
// Enum for the payment method
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CREDIT_CARD"] = "credit_card";
    PaymentMethod["PAYPAL"] = "paypal";
    PaymentMethod["CASH"] = "cash";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
let Billing = class Billing {
};
exports.Billing = Billing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Billing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Billing.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: BillingStatus, default: BillingStatus.UNPAID }),
    __metadata("design:type", String)
], Billing.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: PaymentMethod }),
    __metadata("design:type", String)
], Billing.prototype, "payment_method", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ReservationEntity_1.Reservation, (reservation) => reservation.billing),
    (0, typeorm_1.JoinColumn)({ name: 'reservationId' }),
    __metadata("design:type", ReservationEntity_1.Reservation)
], Billing.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Billing.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Billing.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Billing.prototype, "due_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Billing.prototype, "billing_address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Billing.prototype, "payment_date", void 0);
exports.Billing = Billing = __decorate([
    (0, typeorm_1.Entity)()
], Billing);
