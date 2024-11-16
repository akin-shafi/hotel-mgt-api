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
const GuestService_1 = require("../services/GuestService");
const guestService = new GuestService_1.GuestService();
class GuestController {
    createGuest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, email, phone, address } = req.body;
            try {
                const guest = yield guestService.createGuest(fullName, email, phone, address);
                res.status(201).json(guest);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getGuests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const guests = yield guestService.getGuests();
                res.status(200).json(guests);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getGuestById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const guest = yield guestService.getGuestById(parseInt(id));
                if (!guest) {
                    return res.status(404).json({ message: 'Guest not found' });
                }
                res.status(200).json(guest);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = new GuestController();
