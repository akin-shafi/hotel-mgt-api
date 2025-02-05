import { Router } from "express";
import { UsbController } from "../controllers/UsbController";

const router = Router();

/**
 * @swagger
 * /api/usb-devices:
 *   get:
 *     summary: List all connected USB devices
 *     description: Retrieve a list of all USB devices connected to the system.
 *     tags: [USB Devices]
 *     responses:
 *       200:
 *         description: Successfully retrieved USB devices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 devices:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       busNumber:
 *                         type: number
 *                       deviceAddress:
 *                         type: number
 *                       deviceDescriptor:
 *                         type: object
 */
router.get("/", UsbController.listDevices);

/**
 * @swagger
 * /api/printers:
 *   get:
 *     summary: List all available printers
 *     description: Retrieve a list of printers installed on the system.
 *     tags: [Printers]
 *     responses:
 *       200:
 *         description: Successfully retrieved printers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 printers:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get("/printers", UsbController.listPrinters);

/**
 * @swagger
 * /api/print:
 *   post:
 *     summary: Send a print job to a printer
 *     description: Sends text content to a specified printer for printing.
 *     tags: [Printers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               printerName:
 *                 type: string
 *                 description: The name of the target printer.
 *               content:
 *                 type: string
 *                 description: The text content to print.
 *     responses:
 *       200:
 *         description: Successfully sent the print job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing printer name or content
 *       500:
 *         description: Error sending print job
 */
router.post("/print", UsbController.printTest);

export default router;
