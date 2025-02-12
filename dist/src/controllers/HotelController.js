"use strict";
// hotelController.ts
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
const HotelService_1 = require("../services/HotelService");
const hotelService = new HotelService_1.HotelService();
class HotelController {
    // Create a new hotel
    createOrUpdateHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = req.body, { email, name, tenantId } = _a, otherFields = __rest(_a, ["email", "name", "tenantId"]);
                // Check if a hotel with the given email exists
                const existingHotel = yield HotelService_1.HotelService.getHotelByEmail(email);
                if (existingHotel) {
                    // Update the existing hotel
                    const updatedHotel = yield HotelService_1.HotelService.update(tenantId, Object.assign({ name,
                        tenantId }, otherFields));
                    return res.status(200).json({
                        statusCode: 200,
                        message: `Hotel record for ${email} updated successfully.`,
                        hotel: updatedHotel,
                    });
                }
                // Create a new hotel
                const newHotel = yield HotelService_1.HotelService.create(Object.assign({ email,
                    name,
                    tenantId }, otherFields));
                return res.status(201).json({
                    statusCode: 201,
                    message: `Account created for ${name} hotel successfully and an email has been sent.`,
                    hotel: newHotel,
                });
            }
            catch (error) {
                console.error('Error processing hotel:', error);
                return res.status(500).json({
                    message: 'Server error',
                    error: error.message,
                });
            }
        });
    }
    // Get all hotels
    getAllHotels(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotels = yield HotelService_1.HotelService.getAllHotels();
                return res.status(200).json(hotels);
            }
            catch (error) {
                console.error('Error retrieving hotels:', error);
                return res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }
    // Get a hotel by ID
    getHotelById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const hotel = yield HotelService_1.HotelService.getHotelById(id);
                return hotel ? res.status(200).json(hotel) : res.status(404).json({ message: 'Hotel not found' });
            }
            catch (error) {
                console.error('Error retrieving hotel by ID:', error);
                return res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }
    // Get a hotel by tenantId
    getHotelByTenantId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req.params;
                const hotel = yield HotelService_1.HotelService.getHotelByTenantId(tenantId);
                return hotel ? res.status(200).json(hotel) : res.status(200).json([]);
            }
            catch (error) {
                console.error('Error retrieving hotel by tenantId:', error);
                return res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }
    // Update a hotel
    updateHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const updateData = req.body;
                const updatedHotel = yield HotelService_1.HotelService.updateHotel(id, updateData);
                return updatedHotel ? res.status(200).json(updatedHotel) : res.status(404).json({ message: 'Hotel not found' });
            }
            catch (error) {
                console.error('Error updating hotel:', error);
                return res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }
    // Delete a hotel
    deleteHotel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const isDeleted = yield HotelService_1.HotelService.deleteHotel(id);
                return isDeleted ? res.status(200).json({ message: 'Hotel deleted successfully' }) : res.status(404).json({ message: 'Hotel not found' });
            }
            catch (error) {
                console.error('Error deleting hotel:', error);
                return res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }
}
exports.default = new HotelController();
