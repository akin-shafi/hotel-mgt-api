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
exports.RoomTypeService = void 0;
// src/services/RoomService.ts
const data_source_1 = require("../data-source");
const RoomTypeEntity_1 = require("../entities/RoomTypeEntity");
const roomRepository = data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType);
class RoomTypeService {
    static getRoomByTenantIdAndRoomType(tenantId, roomType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find educational details by both applicationNo and courseOfStudy
                return yield roomRepository.findOne({
                    where: {
                        tenantId,
                        roomType
                    }
                });
            }
            catch (error) {
                throw new Error(`Error finding educational details by application number and course of study: ${error.message}`);
            }
        });
    }
    static getAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType).find();
        });
    }
    static getRoomsByTenantId(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomRepository = data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType);
                // Fetch rooms by talentId
                const rooms = yield roomRepository.find({
                    where: { tenantId }, // Assuming "hotelId" exists in your Room entity
                });
                return rooms;
            }
            catch (error) {
                console.error("Error fetching rooms by hotel ID:", error);
                throw new Error("Unable to fetch rooms.");
            }
        });
    }
    static getRoomById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType).findOneBy({ id });
        });
    }
    static createRoom(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomData = roomRepository.create(data);
                return yield roomRepository.save(roomData);
            }
            catch (error) {
                throw new Error(`Error creating room details: ${error.message}`);
            }
        });
    }
    static updateRoom(id, roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType).update({ id }, roomData);
            return yield data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType).findOneBy({ id });
        });
    }
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield roomRepository.update(id, data);
                return yield roomRepository.findOneBy({ id });
            }
            catch (error) {
                throw new Error(`Error updating Room details: ${error.message}`);
            }
        });
    }
    static deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield data_source_1.AppDataSource.getRepository(RoomTypeEntity_1.RoomType).delete({ id });
            return deleteResult.affected > 0;
        });
    }
}
exports.RoomTypeService = RoomTypeService;
