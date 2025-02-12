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
const ReservationEntity_1 = require("../entities/ReservationEntity");
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
    // static async getAvailableRoomsByType(hotelId: number, startDate: Date, endDate: Date) {
    //   const roomRepository = AppDataSource.getRepository(Room);
    //   // Ensure the query focuses on the date only
    //   const startOfDay = new Date(startDate);
    //   startOfDay.setHours(0, 0, 0, 0);
    //   const endOfDay = new Date(endDate);
    //   endOfDay.setHours(23, 59, 59, 999);
    //   // Query the room repository to get available rooms within the date range
    //   const rooms = await roomRepository.find({
    //     where: {
    //       hotelId,
    //       isAvailable: true,
    //       maintenanceStatus: MaintenanceStatus.CLEAN,
    //       updatedAt: Between(startOfDay, endOfDay)
    //     },
    //     order: { roomType: 'ASC' },
    //   });
    //   // Group the rooms by room type and count the available rooms
    //   const availableRoomsByType = rooms.reduce((acc, room) => {
    //     if (!acc[room.roomType]) {
    //       acc[room.roomType] = 0;
    //     }
    //     acc[room.roomType]++;
    //     return acc;
    //   }, {});
    //   console.log(`Available Rooms by Type: ${JSON.stringify(availableRoomsByType)}`);
    //   return availableRoomsByType;
    // }
    static getRoomStatusByType(hotelId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
            // Ensure the query focuses on the date only
            const startOfDay = new Date(startDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            // Query the room repository to get all rooms within the date range
            const rooms = yield roomRepository.find({
                where: { hotelId, updatedAt: (0, typeorm_1.Between)(startOfDay, endOfDay) },
                order: { roomType: 'ASC' }
            });
            // Initialize the result object
            const result = {
                available: {},
                occupied: {}
            };
            // Populate the result object
            rooms.forEach(room => {
                const roomType = room.roomType;
                if (room.isAvailable && room.maintenanceStatus === constants_1.MaintenanceStatus.CLEAN) {
                    if (!result.available[roomType]) {
                        result.available[roomType] = 0;
                    }
                    result.available[roomType]++;
                }
                else {
                    if (!result.occupied[roomType]) {
                        result.occupied[roomType] = 0;
                    }
                    result.occupied[roomType]++;
                }
            });
            // Calculate total available and occupied rooms
            result.available["Total Available"] = Object.values(result.available).reduce((acc, value) => acc + value, 0);
            result.occupied["Total Occupied"] = Object.values(result.occupied).reduce((acc, value) => acc + value, 0);
            console.log(`Room Status by Type: ${JSON.stringify(result)}`);
            return result;
        });
    }
    static getOccupancyPercentage(hotelId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
            const reservationRepository = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
            // Ensure the query focuses on the date only
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            // Get all rooms for the hotel
            const totalRooms = yield roomRepository.count({ where: { hotelId } });
            // Get all reservations for the hotel on the given date
            const reservations = yield reservationRepository.find({
                where: {
                    hotelId,
                    updatedAt: (0, typeorm_1.Between)(startOfDay, endOfDay),
                },
                relations: ['bookedRooms'],
            });
            // Count occupied rooms
            const occupiedRooms = reservations.reduce((acc, reservation) => {
                return acc + reservation.bookedRooms.length;
            }, 0);
            // Calculate occupancy percentage
            const occupancyPercentage = (occupiedRooms / totalRooms) * 100;
            console.log(`Occupancy Percentage: ${occupancyPercentage}`);
            return occupancyPercentage;
        });
    }
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
