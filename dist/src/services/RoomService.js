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
const constants_1 = require("../constants");
const typeorm_1 = require("typeorm");
const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
class RoomService {
    static getRoomByHotelIdAndRoomName(hotelId, roomName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find educational details by both applicationNo and courseOfStudy
                return yield roomRepository.findOne({
                    where: {
                        hotelId,
                        roomName
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
            return yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).find({
                order: { id: 'ASC' },
            });
        });
    }
    static getRoomsByStatus(hotelId, status, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
            // Define status conditions based on the status input
            let statusCondition = {};
            if (status === 'available') {
                statusCondition = { isAvailable: true, maintenanceStatus: constants_1.MaintenanceStatus.CLEAN };
            }
            else if (status === 'occupied') {
                statusCondition = { isAvailable: true, maintenanceStatus: constants_1.MaintenanceStatus.OCCUPIED };
            }
            else if (status === 'outOfOrder') {
                statusCondition = { maintenanceStatus: constants_1.MaintenanceStatus.OUT_OF_ORDER };
            }
            else {
                throw new Error('Invalid status');
            }
            console.log(`Status Condition: ${JSON.stringify(statusCondition)}`);
            // Ensure the query focuses on the date only
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            // Query the room repository with the defined conditions and date range
            const rooms = yield roomRepository.find({
                where: Object.assign(Object.assign({ hotelId }, statusCondition), { updatedAt: (0, typeorm_1.Between)(startOfDay, endOfDay) }),
                order: { roomName: 'ASC' },
            });
            console.log(`Query Result: ${JSON.stringify(rooms)}`);
            return rooms;
        });
    }
    // static async getRoomsByStatus(hotelId: number, status: string, startDate: Date, endDate: Date) {
    //   const roomRepository = AppDataSource.getRepository(Room);
    //   // Define status conditions based on the status input
    //   let statusCondition = {};
    //   if (status === 'available') {
    //     statusCondition = { isAvailable: true, maintenanceStatus: MaintenanceStatus.CLEAN };
    //   } else if (status === 'occupied') {
    //     statusCondition = { isAvailable: true, maintenanceStatus: MaintenanceStatus.OCCUPIED };
    //   } else if (status === 'outOfOrder') {
    //     statusCondition = { maintenanceStatus: MaintenanceStatus.OUT_OF_ORDER };
    //   } else {
    //     throw new Error('Invalid status');
    //   }
    //   console.log(`Status Condition: ${JSON.stringify(statusCondition)}`);
    //   // Query the room repository with the defined conditions and date range
    //   const rooms = await roomRepository.find({
    //     where: { hotelId, ...statusCondition, updatedAt: Between(startDate, endDate) },
    //     order: { roomName: 'ASC' },
    //   });
    //   console.log(`Query Result: ${JSON.stringify(rooms)}`);
    //   return rooms;
    // }
    static getRoomsByhotelId(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
                // Fetch rooms by hotelId and order by roomName in ascending order
                const rooms = yield roomRepository.find({
                    where: { hotelId },
                    order: { roomName: 'ASC' },
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
            yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).update({ id }, roomData);
            return yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).findOneBy({ id });
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
            const deleteResult = yield data_source_1.AppDataSource.getRepository(RoomEntity_1.Room).delete({ id });
            return deleteResult.affected > 0;
        });
    }
}
exports.RoomService = RoomService;
