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
exports.GuestService = void 0;
const data_source_1 = require("../data-source");
const GuestEntity_1 = require("../entities/GuestEntity");
const guestRepository = data_source_1.AppDataSource.getRepository(GuestEntity_1.Guest);
class GuestService {
    // GuestService
    static createGuest(guestDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const guest = guestRepository.create(guestDetails);
            yield guestRepository.save(guest);
            return guest;
        });
    }
    getGuests() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield guestRepository.find();
        });
    }
    getGuestById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, relations = []) {
            const guestRepo = data_source_1.AppDataSource.getRepository(GuestEntity_1.Guest);
            return guestRepo.findOne({
                where: { id },
                relations, // Dynamically include the specified relations
            });
        });
    }
    static findGuestByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const normalizedEmail = email.trim().toLowerCase();
                console.log(`Searching for guest with email: ${normalizedEmail}`); // Debugging
                return yield guestRepository.findOne({ where: { email: normalizedEmail } });
            }
            catch (error) {
                console.error('Error finding guest by email:', error);
                throw new Error('Could not find guest by email');
            }
        });
    }
    static updateGuest(id, guestDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield guestRepository.update(id, guestDetails);
            const updatedGuest = yield guestRepository.findOne({ where: { id } });
            if (!updatedGuest) {
                throw new Error('Guest not found');
            }
            return updatedGuest;
        });
    }
    static deleteGuest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield guestRepository.delete(id);
            if (result.affected === 0) {
                throw new Error('Guest not found');
            }
            return { message: 'Guest deleted successfully' };
        });
    }
}
exports.GuestService = GuestService;
