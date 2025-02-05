import { Request, Response } from "express";
import usb from "usb";
import printer from "node-printer";

export class UsbController {
  static listDevices(req: Request, res: Response) {
    try {
      const devices = usb.getDeviceList().map((device) => ({
        busNumber: device.busNumber,
        deviceAddress: device.deviceAddress,
        deviceDescriptor: device.deviceDescriptor,
      }));

      return res.json({ success: true, devices });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error listing devices", error });
    }
  }

  static listPrinters(req: Request, res: Response) {
    try {
      const printers = printer.getPrinters();
      return res.json({ success: true, printers });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error listing printers", error });
    }
  }

  static printTest(req: Request, res: Response) {
    try {
      const { printerName, content } = req.body;

      if (!printerName || !content) {
        return res.status(400).json({ success: false, message: "Printer name and content are required" });
      }

      printer.printDirect({
        printer: printerName,
        text: content,
        type: "TEXT",
        success: () => res.json({ success: true, message: "Print job sent successfully" }),
        error: (err) => res.status(500).json({ success: false, message: "Printing error", error: err }),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Error sending print job", error });
    }
  }
}
