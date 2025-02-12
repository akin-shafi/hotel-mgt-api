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
exports.DashboardMetricsService = void 0;
const data_source_1 = require("../data-source");
const constants_1 = require("../constants");
const RoomEntity_1 = require("../entities/RoomEntity");
const BookedRoomEntity_1 = require("../entities/BookedRoomEntity");
class DashboardMetricsService {
    // static async getRoomStatus(hotelId: number, startDate: Date, endDate: Date) {
    //   const roomRepository = AppDataSource.getRepository(Room);
    //   const bookedRoomRepository = AppDataSource.getRepository(BookedRoom);
    //   // Fetch all rooms for the hotel
    //   const rooms = await roomRepository.find({ where: { hotelId } });
    //   // Fetch booked rooms within the date range
    //   const bookedRooms = await bookedRoomRepository.createQueryBuilder('booked_rooms')
    //     .innerJoinAndSelect('booked_rooms.room', 'room')
    //     .where('room.hotelId = :hotelId', { hotelId })
    //     .andWhere('booked_rooms.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
    //     .getMany();
    //   const roomStatus = {
    //     available: rooms.filter(room => room.isAvailable && room.maintenanceStatus === MaintenanceStatus.CLEAN).length,
    //     occupied: bookedRooms.length,
    //     outOfOrder: rooms.filter(room => room.maintenanceStatus !== MaintenanceStatus.CLEAN).length,
    //   };
    //   return roomStatus;
    // }
    static getRoomStatus(hotelId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomRepository = data_source_1.AppDataSource.getRepository(RoomEntity_1.Room);
            const bookedRoomRepository = data_source_1.AppDataSource.getRepository(BookedRoomEntity_1.BookedRoom);
            const rooms = yield roomRepository.find({ where: { hotelId } });
            let bookedRooms = [];
            if (startDate && endDate) {
                bookedRooms = yield bookedRoomRepository.createQueryBuilder('booked_rooms')
                    .innerJoinAndSelect('booked_rooms.room', 'room')
                    .where('room.hotelId = :hotelId', { hotelId })
                    .andWhere('booked_rooms.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
                    .getMany();
            }
            const roomStatus = {
                available: rooms.filter(room => room.isAvailable && room.maintenanceStatus === constants_1.MaintenanceStatus.CLEAN).length,
                // occupied: bookedRooms.length,
                occupied: rooms.filter(room => room.maintenanceStatus === constants_1.MaintenanceStatus.OCCUPIED).length,
                outOfOrder: rooms.filter(room => room.maintenanceStatus === constants_1.MaintenanceStatus.OUT_OF_ORDER).length,
            };
            return roomStatus;
        });
    }
}
exports.DashboardMetricsService = DashboardMetricsService;
