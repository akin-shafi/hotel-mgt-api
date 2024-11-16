// hotelController.ts

import { Request, Response } from 'express';
import { HotelService } from '../services/HotelService';

const hotelService = new HotelService();

class HotelController {
  // Create a new hotel
  public async createOrUpdateHotel(req: Request, res: Response): Promise<Response> {
    try {
      const { email, name, tenantId, ...otherFields } = req.body;
  
      // Check if a hotel with the given email exists
      const existingHotel = await hotelService.getHotelByEmail(email);
  
      if (existingHotel) {
        // Update the existing hotel
        const updatedHotel = await hotelService.update(tenantId, {
          name,
          tenantId,
          ...otherFields,
        });
  
        return res.status(200).json({
          statusCode: 200,
          message: `Hotel record for ${email} updated successfully.`,
          hotel: updatedHotel,
        });
      }
  
      // Create a new hotel
      const newHotel = await hotelService.create({
        email,
        name,
        tenantId,
        ...otherFields,
      });
  
      return res.status(201).json({
        statusCode: 201,
        message: `Account created for ${name} hotel successfully and an email has been sent.`,
        hotel: newHotel,
      });
    } catch (error) {
      console.error('Error processing hotel:', error);
      return res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  }
  
  
  // Get all hotels
  public async getAllHotels(req: Request, res: Response): Promise<Response> {
    try {
      const hotels = await hotelService.getAllHotels();
      return res.status(200).json(hotels);
    } catch (error) {
      console.error('Error retrieving hotels:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get a hotel by ID
  public async getHotelById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const hotel = await hotelService.getHotelById(id);
      return hotel ? res.status(200).json(hotel) : res.status(404).json({ message: 'Hotel not found' });
    } catch (error) {
      console.error('Error retrieving hotel by ID:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get a hotel by tenantId
  public async getHotelByTenantId(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.params;
      const hotel = await hotelService.getHotelByTenantId(tenantId);
      return hotel ? res.status(200).json(hotel) : res.status(200).json([]);
    } catch (error) {
      console.error('Error retrieving hotel by tenantId:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
  

  // Update a hotel
  public async updateHotel(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedHotel = await hotelService.updateHotel(id, updateData);
      return updatedHotel ? res.status(200).json(updatedHotel) : res.status(404).json({ message: 'Hotel not found' });
    } catch (error) {
      console.error('Error updating hotel:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a hotel
  public async deleteHotel(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);
      const isDeleted = await hotelService.deleteHotel(id);
      return isDeleted ? res.status(200).json({ message: 'Hotel deleted successfully' }) : res.status(404).json({ message: 'Hotel not found' });
    } catch (error) {
      console.error('Error deleting hotel:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new HotelController();

