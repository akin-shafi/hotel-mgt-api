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
exports.BillingService = void 0;
// src/services/BillingService.ts
const data_source_1 = require("../data-source");
const BillingEntity_1 = require("../entities/BillingEntity");
const ReservationEntity_1 = require("../entities/ReservationEntity");
const constants_1 = require("../constants");
const billingRepository = data_source_1.AppDataSource.getRepository(BillingEntity_1.Billing);
const reservationRepository = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
class BillingService {
    // BillingService
    static createBill(billDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = billingRepository.create(billDetails);
            return billingRepository.save(user);
        });
    }
    payBill(billId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bill = yield billingRepository.findOne({ where: { id: billId } });
            if (!bill)
                throw new Error('Bill not found');
            // Assign the enum value for "paid"
            bill.status = constants_1.BillingStatus.COMPLETE_PAYMENT;
            yield billingRepository.save(bill);
            // Optionally, update reservation status to "completed"
            const reservation = bill.reservation;
            reservation.reservationStatus = constants_1.ReservationStatus.CONFIRMED; // Ensure 'completed' is valid in the Reservation entity
            yield reservationRepository.save(reservation);
            return bill;
        });
    }
    getBills() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield billingRepository.find({ relations: ['reservation'] });
        });
    }
    getBillById(billId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield billingRepository.findOne({ where: { id: billId }, relations: ['reservation'] });
        });
    }
    getBillByReservationId(reservationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield billingRepository.findOne({
                where: { reservation: { id: reservationId } }, // Adjusted to query by `reservation.id`
                relations: ["reservation"], // Ensure the relation is loaded
            });
        });
    }
}
exports.BillingService = BillingService;
