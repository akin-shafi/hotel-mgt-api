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
exports.PromotionsController = void 0;
const data_source_1 = require("../data-source");
const PromotionEntity_1 = require("../entities/PromotionEntity");
const promotionRepository = data_source_1.AppDataSource.getRepository(PromotionEntity_1.Promotion);
class PromotionsController {
    // Get by Code
    static getByCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            try {
                const promotion = yield promotionRepository.findOne({ where: { code } });
                if (!promotion) {
                    return res.status(404).json({ status: 404, message: "Promotion code not found" });
                }
                if (promotion.status != "active") {
                    return res.status(404).json({ status: 209, message: "Promotion code is inactive" });
                }
                res.json({ status: 200, result: promotion, message: "record found" });
            }
            catch (error) {
                res.status(500).json({ status: 500, message: "Internal server error", error });
            }
        });
    }
    // Get All
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const promotions = yield promotionRepository.find();
                res.json(promotions);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    static generateUniqueCode() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }
    // Ensure the generated code is unique by checking the database
    static generateUniqueCodeWithCheck() {
        return __awaiter(this, void 0, void 0, function* () {
            let code;
            let exists;
            do {
                code = PromotionsController.generateUniqueCode();
                const existingPromotion = yield promotionRepository.findOne({ where: { code } });
                exists = !!existingPromotion;
            } while (exists);
            return code;
        });
    }
    // Create a new promotion
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, status, createdBy, usedBy, usedFor, hotelId } = req.body;
            try {
                const code = yield PromotionsController.generateUniqueCodeWithCheck(); // Ensure unique code
                const promotion = promotionRepository.create({
                    code,
                    type,
                    status,
                    createdBy,
                    usedBy,
                    usedFor,
                    hotelId,
                });
                yield promotionRepository.save(promotion);
                res.status(201).json(promotion);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    // Edit
    static edit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateData = req.body;
            try {
                const promotion = yield promotionRepository.findOneBy({ id: +id });
                if (!promotion) {
                    return res.status(404).json({ message: "Promotion not found" });
                }
                Object.assign(promotion, updateData);
                yield promotionRepository.save(promotion);
                res.json(promotion);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
    // Delete
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const promotion = yield promotionRepository.findOneBy({ id: +id });
                if (!promotion) {
                    return res.status(404).json({ message: "Promotion not found" });
                }
                yield promotionRepository.remove(promotion);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error", error });
            }
        });
    }
}
exports.PromotionsController = PromotionsController;
