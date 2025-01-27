import { Router } from "express";
import { PromotionsController } from "../controllers/PromotionsController";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: API for managing promotions
 */

/**
 * @swagger
 * /promotions/{code}:
 *   get:
 *     summary: Get a promotion by code
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: The promotion code
 *     responses:
 *       200:
 *         description: The promotion with the specified code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found
 */
router.get("/:code", PromotionsController.getByCode);

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 */
router.get("/", PromotionsController.getAll);

/**
 * @swagger
 * /promotions:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromotionCreate'
 *           example:
 *             code: "ABC123"
 *             type: "Discount"
 *             status: "active"
 *             createdBy: "admin"
 *             usedBy: "user123"
 *             usedFor: "RoomBooking"
 *             hotelId: 1
 *     responses:
 *       201:
 *         description: The created promotion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *             example:
 *               id: 1
 *               code: "ABC123"
 *               type: "Discount"
 *               status: "active"
 *               createdBy: "admin"
 *               usedBy: "user123"
 *               usedFor: "RoomBooking"
 *               hotelId: 1
 *               createdAt: "2025-01-26T12:00:00.000Z"
 *               updatedAt: "2025-01-26T12:00:00.000Z"
 *       500:
 *         description: Internal server error
 */
router.post("/", PromotionsController.create);


/**
 * @swagger
 * /promotions/{id}:
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PromotionUpdate'
 *     responses:
 *       200:
 *         description: The updated promotion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", PromotionsController.edit);

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The promotion ID
 *     responses:
 *       200:
 *         description: Promotion deleted
 *       404:
 *         description: Promotion not found
 */
router.delete("/:id", PromotionsController.delete);

export default router;
