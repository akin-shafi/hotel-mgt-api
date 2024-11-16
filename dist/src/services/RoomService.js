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
exports.RoomService = void 0;
// src/services/RoomService.ts
const data_source_1 = require("../data-source");
const RoomEntity_1 = require("../entities/RoomEntity");
class RoomService {
    static getAllRooms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).find();
        });
    }
    static getRoomsByTenantId(talentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
                // Fetch rooms by talentId
                const rooms = yield roomRepository.find({
                    where: { talentId }, // Assuming "hotelId" exists in your Room entity
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
            return yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).findOneBy({ id });
        });
    }
    static createRoom(roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).create(roomData);
            return yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).save(room);
        });
    }
    static updateRoom(id, roomData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).update({ id }, roomData);
            return yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).findOneBy({ id });
        });
    }
    static deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).delete({ id });
            return deleteResult.affected > 0;
        });
    }
}
exports.RoomService = RoomService;
