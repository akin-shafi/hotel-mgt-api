"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/HotelDetailsRoutes.ts
const express_1 = require("express");
const HotelDetailsController_1 = require("../controllers/HotelDetailsController");
const router = (0, express_1.Router)();
// Hotel Details Endpoints
router.get('/', HotelDetailsController_1.HotelDetailsController.getHotelInfo); // Fetch all hotel details (e.g., name, address, policies)
router.put('/', HotelDetailsController_1.HotelDetailsController.updateHotelInfo); // Update hotel information/settings
router.get('/amenities', HotelDetailsController_1.HotelDetailsController.getAmenities); // Fetch list of hotel amenities
router.put('/amenities', HotelDetailsController_1.HotelDetailsController.updateAmenities); // Update list of hotel amenities
router.get('/policies', HotelDetailsController_1.HotelDetailsController.getPolicies); // Fetch hotel policies (e.g., check-in/check-out times)
router.put('/policies', HotelDetailsController_1.HotelDetailsController.updatePolicies); // Update hotel policies
exports.default = router;
