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
exports.RoomController = void 0;
const RoomTypeService_1 = require("../services/RoomTypeService");
const roomService = new RoomTypeService_1.RoomTypeService();
class RoomController {
    static getAllRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield RoomTypeService_1.RoomTypeService.getAllRooms();
                res.json(rooms);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve rooms' });
            }
        });
    }
    static getRoomById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield RoomTypeService_1.RoomTypeService.getRoomById(Number(req.params.id));
                room ? res.json(room) : res.status(404).json({ error: 'Room not found' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to retrieve room' });
            }
        });
    }
    static getRoomsByTenantId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId } = req.params;
                const rooms = yield RoomTypeService_1.RoomTypeService.getRoomsByTenantId(tenantId);
                return rooms ? res.status(200).json(rooms) : res.status(200).json([]);
            }
            catch (error) {
                console.error('Error retrieving hotel by tenantId:', error);
                return res.status(500).json({ message: 'Server error', error: error.message });
            }
        });
    }
    static createRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tenantId, hotelId, roomData } = req.body;
                console.log("RoomData", Array.isArray(roomData));
                // Validate tenantId
                if (!tenantId) {
                    return res.status(400).json({ statusCode: 400, message: 'Tenant Id is required' });
                }
                // Validate roomData is an array
                if (!Array.isArray(roomData)) {
                    return res.status(400).json({ statusCode: 400, message: 'Room data should be an array' });
                }
                // Check if the tenant exists by tenantId
                const existingTenant = yield RoomTypeService_1.RoomTypeService.getRoomsByTenantId(tenantId);
                if (!existingTenant) {
                    return res.status(404).json({ statusCode: 404, message: 'Tenant not found' });
                }
                // Arrays to keep track of updated and new rooms
                const updatedRooms = [];
                const newRooms = [];
                // Process each room in roomData
                for (const [index, room] of roomData.entries()) {
                    if (room && typeof room === 'object') {
                        const { roomType, numRooms, currency, pricePerNight } = room, restOfRoom = __rest(room, ["roomType", "numRooms", "currency", "pricePerNight"]);
                        // Validate required room fields
                        if (!roomType) {
                            return res.status(400).json({ statusCode: 400, message: `At Row ${index + 1}: Room type is required` });
                        }
                        if (typeof numRooms !== 'number' || numRooms <= 0) {
                            return res.status(400).json({
                                statusCode: 400,
                                message: `At Row ${index + 1}: Number of rooms must be a positive integer`
                            });
                        }
                        if (!currency) {
                            return res.status(400).json({ statusCode: 400, message: `At Row ${index + 1}: Currency is required` });
                        }
                        if (typeof pricePerNight !== 'number' || pricePerNight <= 0) {
                            return res.status(400).json({
                                statusCode: 400,
                                message: `At Row ${index + 1}: Price per night must be a positive number`
                            });
                        }
                        // Check if the room already exists for this tenant and room type
                        const existingRoom = yield RoomTypeService_1.RoomTypeService.getRoomByTenantIdAndRoomType(tenantId, roomType);
                        if (existingRoom) {
                            // Update the existing room
                            yield RoomTypeService_1.RoomTypeService.update(existingRoom.id, Object.assign({ tenantId,
                                hotelId,
                                roomType,
                                numRooms,
                                currency,
                                pricePerNight }, restOfRoom));
                            updatedRooms.push(Object.assign(Object.assign({}, existingRoom), restOfRoom));
                        }
                        else {
                            // Create a new room
                            const newRoom = yield RoomTypeService_1.RoomTypeService.createRoom(Object.assign({ tenantId,
                                hotelId,
                                roomType,
                                numRooms,
                                currency,
                                pricePerNight }, restOfRoom));
                            newRooms.push(newRoom);
                        }
                    }
                }
                return res.status(201).json({
                    message: 'Rooms processed successfully',
                    data: { updatedRooms, newRooms },
                });
            }
            catch (error) {
                console.error('Error creating room:', error);
                return res.status(500).json({ statusCode: 500, message: 'Failed to create room', error: error.message });
            }
        });
    }
    static updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield RoomTypeService_1.RoomTypeService.updateRoom(Number(req.params.id), req.body);
                room ? res.json(room) : res.status(404).json({ error: 'Room not found' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to update room' });
            }
        });
    }
    static deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield RoomTypeService_1.RoomTypeService.deleteRoom(Number(req.params.id));
                success ? res.status(204).end() : res.status(404).json({ error: 'Room not found' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete room' });
            }
        });
    }
}
exports.RoomController = RoomController;
