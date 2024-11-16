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
const billingService = new BillingService_1.BillingService();
class BillingController {
    createBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reservationId, amount, paymentMethod } = req.body;
            try {
                const bill = yield billingService.createBill(reservationId, amount, paymentMethod);
                res.status(201).json(bill);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
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
}
exports.default = new BillingController();
