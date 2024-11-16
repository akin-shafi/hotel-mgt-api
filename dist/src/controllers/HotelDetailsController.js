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
exports.HotelDetailsController = void 0;
const HotelEnitity_1 = require("../entities/HotelEnitity");
const data_source_1 = require("../data-source");
class HotelDetailsController {
    // Get general hotel information
    static getHotelInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse hotelId to number if it exists and is a single string
                const hotelId = Array.isArray(req.query.hotelId)
                    ? parseInt(req.query.hotelId[0], 10)
                    : parseInt(req.query.hotelId, 10);
                if (isNaN(hotelId)) {
                    return res.status(400).json({ message: 'Invalid hotel ID' });
                }
                const hotel = yield data_source_1.AppDataSource.getRepository(HotelEnitity_1.Hotel).findOne({
                    where: { id: hotelId }
                });
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
                res.status(200).json(hotel);
            }
            catch (error) {
                console.error('Error fetching hotel info:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Update general hotel information
    static updateHotelInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelRepository = data_source_1.AppDataSource.getRepository(HotelEnitity_1.Hotel);
                const hotel = yield hotelRepository.findOne({ where: { id: req.body.hotelId } });
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
                hotel.name = req.body.name || hotel.name;
                hotel.address = req.body.address || hotel.address;
                hotel.city = req.body.city || hotel.city;
                hotel.country = req.body.country || hotel.country;
                hotel.phone = req.body.phone || hotel.phone;
                hotel.email = req.body.email || hotel.email;
                hotel.logoUrl = req.body.logoUrl || hotel.logoUrl;
                hotel.theme = req.body.theme || hotel.theme;
                yield hotelRepository.save(hotel);
                res.status(200).json({ message: 'Hotel information updated successfully', hotel });
            }
            catch (error) {
                console.error('Error updating hotel info:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Get hotel amenities
    static getAmenities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse hotelId to a number if it exists and is a single string
                const hotelId = Array.isArray(req.query.hotelId)
                    ? parseInt(req.query.hotelId[0], 10)
                    : parseInt(req.query.hotelId, 10);
                if (isNaN(hotelId)) {
                    return res.status(400).json({ message: 'Invalid hotel ID' });
                }
                const hotel = yield data_source_1.AppDataSource.getRepository(HotelEnitity_1.Hotel).findOne({
                    where: { id: hotelId },
                    select: ['amenities']
                });
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
                res.status(200).json(hotel.amenities || []);
            }
            catch (error) {
                console.error('Error fetching amenities:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Update hotel amenities
    static updateAmenities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelRepository = data_source_1.AppDataSource.getRepository(HotelEnitity_1.Hotel);
                const hotel = yield hotelRepository.findOne({ where: { id: req.body.hotelId } });
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
                hotel.amenities = req.body.amenities;
                yield hotelRepository.save(hotel);
                res.status(200).json({ message: 'Amenities updated successfully', amenities: hotel.amenities });
            }
            catch (error) {
                console.error('Error updating amenities:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Get hotel policies
    static getPolicies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse hotelId to a number if it exists and is a single string
                const hotelId = Array.isArray(req.query.hotelId)
                    ? parseInt(req.query.hotelId[0], 10)
                    : parseInt(req.query.hotelId, 10);
                if (isNaN(hotelId)) {
                    return res.status(400).json({ message: 'Invalid hotel ID' });
                }
                const hotel = yield data_source_1.AppDataSource.getRepository(HotelEnitity_1.Hotel).findOne({
                    where: { id: hotelId },
                    select: ['policies']
                });
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
                res.status(200).json(hotel.policies || {});
            }
            catch (error) {
                console.error('Error fetching policies:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    // Update hotel policies
    static updatePolicies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hotelRepository = data_source_1.AppDataSource.getRepository(HotelEnitity_1.Hotel);
                const hotel = yield hotelRepository.findOne({ where: { id: req.body.hotelId } });
                if (!hotel) {
                    return res.status(404).json({ message: 'Hotel not found' });
                }
                hotel.policies = req.body.policies;
                yield hotelRepository.save(hotel);
                res.status(200).json({ message: 'Policies updated successfully', policies: hotel.policies });
            }
            catch (error) {
                console.error('Error updating policies:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.HotelDetailsController = HotelDetailsController;
