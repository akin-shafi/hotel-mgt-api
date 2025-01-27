import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Promotion } from "../entities/PromotionEntity";

const promotionRepository = AppDataSource.getRepository(Promotion);

export class PromotionsController {
  // Get by Code
  static async getByCode(req: Request, res: Response) {
    const { code } = req.params;
    try {
      const promotion = await promotionRepository.findOne({ where: { code } });
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  // Get All
  static async getAll(req: Request, res: Response) {
    try {
      const promotions = await promotionRepository.find();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  static generateUniqueCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  // Ensure the generated code is unique by checking the database
  static async generateUniqueCodeWithCheck(): Promise<string> {
    let code: string;
    let exists: boolean;
    do {
      code = PromotionsController.generateUniqueCode();
      const existingPromotion = await promotionRepository.findOne({ where: { code } });
      exists = !!existingPromotion;
    } while (exists);
    return code;
  }

  // Create a new promotion
  static async create(req: Request, res: Response) {
    const { type, status, createdBy, usedBy, usedFor, hotelId } = req.body;
    try {
      const code = await PromotionsController.generateUniqueCodeWithCheck(); // Ensure unique code
      const promotion = promotionRepository.create({
        code,
        type,
        status,
        createdBy,
        usedBy,
        usedFor,
        hotelId,
      });
      await promotionRepository.save(promotion);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  // Edit
  static async edit(req: Request, res: Response) {
    const { id } = req.params;
    const updateData = req.body;
    try {
      const promotion = await promotionRepository.findOneBy({ id: +id });
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      Object.assign(promotion, updateData);
      await promotionRepository.save(promotion);
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  // Delete
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const promotion = await promotionRepository.findOneBy({ id: +id });
      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }
      await promotionRepository.remove(promotion);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
}
