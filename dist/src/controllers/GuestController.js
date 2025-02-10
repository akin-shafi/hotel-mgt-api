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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const GuestService_1 = require("../services/GuestService");
const guestService = new GuestService_1.GuestService();
class GuestController {
    createGuest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullName, email, phone, address } = req.body;
            try {
                const guest = yield GuestService_1.GuestService.createGuest(req.body);
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
                // Fetch guest along with reservations and billing details
                const guest = yield guestService.getGuestById(parseInt(id), ["reservations", "reservations.billing"]);
                if (!guest) {
                    return res.status(404).json({ message: "Guest not found" });
                }
                // Remove redundant guest details inside reservations
                const formattedReservations = guest.reservations.map((reservation) => {
                    const { guest: _ } = reservation, reservationWithoutGuest = __rest(reservation, ["guest"]); // Exclude the guest field
                    return reservationWithoutGuest;
                });
                // Return a cleaned and structured response
                res.status(200).json({
                    guestDetails: Object.assign(Object.assign({}, guest), { reservations: formattedReservations }),
                });
            }
            catch (error) {
                console.error("Error fetching guest by ID:", error.message);
                res.status(400).json({ message: error.message });
            }
        });
    }
    getGuestByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.query; // Use query parameter for email
            try {
                if (!email || typeof email !== "string") {
                    return res.status(400).json({ message: "Email is required and must be a valid string" });
                }
                const guest = yield GuestService_1.GuestService.findGuestByEmail(email);
                if (!guest) {
                    return res.status(404).json({ message: "Guest not found" });
                }
                res.status(200).json(guest);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    updateGuest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { fullName, email, phone, address } = req.body;
            try {
                const updatedGuest = yield GuestService_1.GuestService.updateGuest(Number(id), req.body);
                res.status(200).json(updatedGuest);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    deleteGuest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield GuestService_1.GuestService.deleteGuest(Number(id));
                res.status(200).json({ message: 'Guest deleted successfully' });
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.default = new GuestController();
