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
exports.RoomController = void 0;
const RoomService_1 = require("../services/RoomService");
const roomService = new RoomService_1.RoomService();
class RoomController {
    static getAllRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rooms = yield RoomService_1.RoomService.getAllRooms();
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
                const room = yield RoomService_1.RoomService.getRoomById(Number(req.params.id));
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
                const rooms = yield RoomService_1.RoomService.getRoomsByTenantId(tenantId);
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
                const room = yield RoomService_1.RoomService.createRoom(req.body);
                res.status(201).json(room);
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to create room' });
            }
        });
    }
    static updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const room = yield RoomService_1.RoomService.updateRoom(Number(req.params.id), req.body);
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
                const success = yield RoomService_1.RoomService.deleteRoom(Number(req.params.id));
                success ? res.status(204).end() : res.status(404).json({ error: 'Room not found' });
            }
            catch (error) {
                res.status(500).json({ error: 'Failed to delete room' });
            }
        });
    }
}
exports.RoomController = RoomController;
