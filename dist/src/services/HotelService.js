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
exports.HotelService = void 0;
// hotelService.ts
const data_source_1 = require("../data-source");
const HotelEntity_1 = require("../entities/HotelEntity");
const hotelRepository = data_source_1.AppDataSource.getRepository(HotelEntity_1.Hotel);
class HotelService {
    // Create a new hotel
    static create(hotelData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = hotelRepository.create(hotelData);
            return hotelRepository.save(user);
        });
    }
    static update(tenantId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield hotelRepository.update({ tenantId }, data);
            return yield hotelRepository.findOneBy({ tenantId });
        });
    }
    static generateTenantId(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniqueSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Ensure two digits
            return `${name.replace(/\s+/g, '_').toLowerCase()}_${uniqueSuffix}`; // Generates tenantId based on name and suffix
        });
    }
    // Get all hotels
    static getAllHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hotelRepository.find();
        });
    }
    // Get a hotel by ID
    static getHotelById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hotelRepository.findOne({ where: { id } });
        });
    }
    static getHotelByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hotelRepository.findOne({ where: { email } });
        });
    }
    // Get a hotel by tenantId
    static getHotelByTenantId(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield hotelRepository.findOne({ where: { tenantId } });
        });
    }
    // Update a hotel
    static updateHotel(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const hotel = yield hotelRepository.findOne({ where: { id } });
            if (!hotel)
                return null;
            hotelRepository.merge(hotel, updateData);
            return yield hotelRepository.save(hotel);
        });
    }
    // Delete a hotel
    static deleteHotel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield hotelRepository.delete(id);
            return result.affected > 0;
        });
    }
}
exports.HotelService = HotelService;
