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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DashboardMetricsService_1 = __importDefault(require("../services/DashboardMetricsService"));
const RoomService_1 = require("../services/RoomService");
class DashboardMetricsController {
    getRoomStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotelId, startDate, endDate } = req.query;
            if (!hotelId) {
                return res.status(400).json({ message: 'hotelId is required' });
            }
            try {
                const roomStatus = yield DashboardMetricsService_1.default.getRoomStatus(parseInt(hotelId, 10), new Date(startDate), new Date(endDate));
                return res.json(roomStatus);
            }
            catch (error) {
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        });
    }
    getRoomsByStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hotelId, status, startDate, endDate } = req.query;
                if (!hotelId || !status || !startDate || !endDate) {
                    return res.status(400).send('Missing required parameters');
                }
                const rooms = yield RoomService_1.RoomService.getRoomsByStatus(Number(hotelId), String(status), new Date(String(startDate)), new Date(String(endDate)));
                return res.status(200).json(rooms);
            }
            catch (error) {
                console.error('Error fetching rooms by status:', error);
                return res.status(500).send('Internal Server Error');
            }
        });
    }
}
exports.default = new DashboardMetricsController();
