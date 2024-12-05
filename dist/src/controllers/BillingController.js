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
const BillingService_1 = require("../services/BillingService");
const ReservationService_1 = require("../services/ReservationService"); // Adjust the import path for reservation service
const billingService = new BillingService_1.BillingService();
class BillingController {
    createBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservationId, services } = req.body;
            if (!reservationId || !services || !Array.isArray(services) || services.length === 0) {
                return res.status(400).json({
                    message: "Invalid input. Please provide a reservationId and an array of services.",
                });
            }
            try {
                // Check if the reservation exists
                const reservation = yield ReservationService_1.ReservationService.getReservationById(reservationId);
                if (!reservation) {
                    return res.status(404).json({ message: "Reservation not found." });
                }
                // Generate bills for each service
                const bills = yield Promise.all(services.map((service) => billingService.createBill(Object.assign({ reservationId }, service))));
                // Return all created bills
                res.status(201).json(bills);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    payBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { billId } = req.params;
            try {
                const bill = yield billingService.payBill(parseInt(billId));
                res.status(200).json(bill);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getBills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bills = yield billingService.getBills();
                res.status(200).json(bills);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getBillById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { billId } = req.params;
            try {
                const bill = yield billingService.getBillById(parseInt(billId));
                if (!bill) {
                    return res.status(404).json({ message: 'Bill not found' });
                }
                res.status(200).json(bill);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getBillByReservationId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservationId } = req.params;
            try {
                const bill = yield billingService.getBillByReservationId(parseInt(reservationId));
                if (!bill) {
                    return res.status(404).json({ message: 'Bill not found' });
                }
                res.status(200).json(bill);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = new BillingController();
