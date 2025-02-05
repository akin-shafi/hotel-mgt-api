"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsbController = void 0;
const usb_1 = __importDefault(require("usb"));
const node_printer_1 = __importDefault(require("node-printer"));
class UsbController {
    static listDevices(req, res) {
        try {
            const devices = usb_1.default.getDeviceList().map((device) => ({
                busNumber: device.busNumber,
                deviceAddress: device.deviceAddress,
                deviceDescriptor: device.deviceDescriptor,
            }));
            return res.json({ success: true, devices });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Error listing devices", error });
        }
    }
    static listPrinters(req, res) {
        try {
            const printers = node_printer_1.default.getPrinters();
            return res.json({ success: true, printers });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Error listing printers", error });
        }
    }
    static printTest(req, res) {
        try {
            const { printerName, content } = req.body;
            if (!printerName || !content) {
                return res.status(400).json({ success: false, message: "Printer name and content are required" });
            }
            node_printer_1.default.printDirect({
                printer: printerName,
                text: content,
                type: "TEXT",
                success: () => res.json({ success: true, message: "Print job sent successfully" }),
                error: (err) => res.status(500).json({ success: false, message: "Printing error", error: err }),
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: "Error sending print job", error });
        }
    }
}
exports.UsbController = UsbController;
