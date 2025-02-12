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
const CombineService_1 = require("../services/CombineService");
class CombinedController {
    static getAllMetrics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hotelId, date, year, startDate, endDate } = req.query;
            if (!hotelId || !date || !year) {
                return res.status(400).json({ message: 'hotelId, date, and year are required' });
            }
            try {
                const parsedHotelId = parseInt(hotelId, 10);
                const parsedDate = new Date(date);
                const parsedYear = parseInt(year, 10);
                const parsedStartDate = date ? new Date(date) : undefined;
                const parsedEndDate = date ? new Date(date) : undefined;
                // console.log("parsedStartDate", parsedStartDate)
                if (isNaN(parsedHotelId) || isNaN(parsedDate.getTime()) || isNaN(parsedYear) ||
                    (parsedStartDate && isNaN(parsedStartDate.getTime())) ||
                    (parsedEndDate && isNaN(parsedEndDate.getTime()))) {
                    return res.status(400).json({ message: 'Invalid hotelId, date, year, or date range provided' });
                }
                const metrics = yield CombineService_1.CombinedService.getAllMetrics(parsedHotelId, parsedDate, parsedYear, parsedStartDate, parsedEndDate);
                return res.status(200).json(metrics);
            }
            catch (error) {
                console.error('Error fetching all metrics:', error);
                return res.status(500).json({ message: 'Internal Server Error', error });
            }
        });
    }
}
exports.default = CombinedController;
