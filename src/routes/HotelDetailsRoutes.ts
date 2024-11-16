// src/routes/HotelDetailsRoutes.ts
import { Router } from 'express';
import { HotelDetailsController } from '../controllers/HotelDetailsController';

const router = Router();

// Hotel Details Endpoints
router.get('/', HotelDetailsController.getHotelInfo);  // Fetch all hotel details (e.g., name, address, policies)
router.put('/', HotelDetailsController.updateHotelInfo); // Update hotel information/settings
router.get('/amenities', HotelDetailsController.getAmenities); // Fetch list of hotel amenities
router.put('/amenities', HotelDetailsController.updateAmenities); // Update list of hotel amenities
router.get('/policies', HotelDetailsController.getPolicies); // Fetch hotel policies (e.g., check-in/check-out times)
router.put('/policies', HotelDetailsController.updatePolicies); // Update hotel policies

export default router;
