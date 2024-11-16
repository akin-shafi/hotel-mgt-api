// src/controllers/HotelDetailsController.ts
import { Request, Response } from 'express';
import { Hotel } from '../entities/HotelEnitity';
import { AppDataSource } from '../data-source';

export class HotelDetailsController {
  
  // Get general hotel information
  static async getHotelInfo(req: Request, res: Response) {
    try {
      // Parse hotelId to number if it exists and is a single string
      const hotelId = Array.isArray(req.query.hotelId) 
        ? parseInt(req.query.hotelId[0] as string, 10)
        : parseInt(req.query.hotelId as string, 10);

      if (isNaN(hotelId)) {
        return res.status(400).json({ message: 'Invalid hotel ID' });
      }

      const hotel = await AppDataSource.getRepository(Hotel).findOne({
        where: { id: hotelId }
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.status(200).json(hotel);
    } catch (error) {
      console.error('Error fetching hotel info:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update general hotel information
  static async updateHotelInfo(req: Request, res: Response) {
    try {
      const hotelRepository = AppDataSource.getRepository(Hotel);
      const hotel = await hotelRepository.findOne({ where: { id: req.body.hotelId } });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      hotel.name = req.body.name || hotel.name;
      hotel.address = req.body.address || hotel.address;
      hotel.city = req.body.city || hotel.city;
      hotel.country = req.body.country || hotel.country;
      hotel.phone = req.body.phone || hotel.phone;
      hotel.email = req.body.email || hotel.email;
      hotel.logoUrl = req.body.logoUrl || hotel.logoUrl;
      hotel.theme = req.body.theme || hotel.theme;

      await hotelRepository.save(hotel);
      res.status(200).json({ message: 'Hotel information updated successfully', hotel });
    } catch (error) {
      console.error('Error updating hotel info:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get hotel amenities
  static async getAmenities(req: Request, res: Response) {
    try {
      // Parse hotelId to a number if it exists and is a single string
      const hotelId = Array.isArray(req.query.hotelId)
        ? parseInt(req.query.hotelId[0] as string, 10)
        : parseInt(req.query.hotelId as string, 10);

      if (isNaN(hotelId)) {
        return res.status(400).json({ message: 'Invalid hotel ID' });
      }

      const hotel = await AppDataSource.getRepository(Hotel).findOne({
        where: { id: hotelId },
        select: ['amenities']
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.status(200).json(hotel.amenities || []);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update hotel amenities
  static async updateAmenities(req: Request, res: Response) {
    try {
      const hotelRepository = AppDataSource.getRepository(Hotel);
      const hotel = await hotelRepository.findOne({ where: { id: req.body.hotelId } });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      hotel.amenities = req.body.amenities;
      await hotelRepository.save(hotel);
      res.status(200).json({ message: 'Amenities updated successfully', amenities: hotel.amenities });
    } catch (error) {
      console.error('Error updating amenities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get hotel policies
  static async getPolicies(req: Request, res: Response) {
    try {
      // Parse hotelId to a number if it exists and is a single string
      const hotelId = Array.isArray(req.query.hotelId)
        ? parseInt(req.query.hotelId[0] as string, 10)
        : parseInt(req.query.hotelId as string, 10);

      if (isNaN(hotelId)) {
        return res.status(400).json({ message: 'Invalid hotel ID' });
      }

      const hotel = await AppDataSource.getRepository(Hotel).findOne({
        where: { id: hotelId },
        select: ['policies']
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.status(200).json(hotel.policies || {});
    } catch (error) {
      console.error('Error fetching policies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update hotel policies
  static async updatePolicies(req: Request, res: Response) {
    try {
      const hotelRepository = AppDataSource.getRepository(Hotel);
      const hotel = await hotelRepository.findOne({ where: { id: req.body.hotelId } });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      hotel.policies = req.body.policies;
      await hotelRepository.save(hotel);
      res.status(200).json({ message: 'Policies updated successfully', policies: hotel.policies });
    } catch (error) {
      console.error('Error updating policies:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
