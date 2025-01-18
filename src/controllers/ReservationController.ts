import { Request, Response } from "express";
import { ReservationService } from "../services/ReservationService";
import { Guest } from "../entities/GuestEntity";
import { Billing } from "../entities/BillingEntity";
import { GuestService } from "../services/GuestService";
import { Reservation, } from "../entities/ReservationEntity";
import { AppDataSource } from '../data-source';
import { ActivityType, ReservationStatus, ReservationType  } from "../constants"


const reservationService = new ReservationService();

export class ReservationController {

  static async createReservation(req: Request, res: Response) {
    const { guestDetails, reservationDetails, createdBy, role, billingDetails } = req.body;
  
    try {
      const reservationRepo = AppDataSource.getRepository(Reservation);
  
      // Use the getGuestByEmail service to find an existing guest
      let guest = await GuestService.getGuestByEmail(guestDetails.email);
  
      if (!guest) {
        // Create a new guest if no record exists
        guest = await GuestService.createGuest(guestDetails);
      }
  
      // Check for existing reservation with the same guest and reservation dates
      const existingReservation = await reservationRepo.findOne({
        where: {
          guest: guest,
          checkInDate: reservationDetails.checkInDate,
          checkOutDate: reservationDetails.checkOutDate
        }
      });
  
      if (existingReservation) {
        return res.status(400).json({ error: "Reservation already exists for the same dates." });
      }
  
      // Validate reservation type and status using enums
      if (!Object.values(ReservationType).includes(reservationDetails.reservationType)) {
        return res.status(400).json({ error: "Invalid reservation type." });
      }
  
      if (!Object.values(ReservationStatus).includes(reservationDetails.status)) {
        return res.status(400).json({ error: "Invalid reservation status." });
      }
  
      // Start a transaction to ensure both reservation and billing are saved atomically
      await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        // Create a new reservation linked to the guest
        const newReservation = transactionalEntityManager.create(Reservation, {
          ...reservationDetails,
          guest, // Link the guest object
          createdBy,
          role,
        });
  
        // Save the reservation first to ensure it has an ID for association
        const savedReservation = await transactionalEntityManager.save(newReservation);
  
        // Create the new billing linked to the saved reservation
        const newBilling = transactionalEntityManager.create(Billing, {
          ...billingDetails, // Assume billingDetails contains necessary info such as billing address, payment method, etc.
          reservation: savedReservation, // Link billing to the saved reservation
        });
  
        // Save the billing details
        await transactionalEntityManager.save(newBilling);
  
        // Send response with the new reservation and billing details
        // res.status(201).json({
        //   reservation: savedReservation,
        //   billing: newBilling
        // });
        res.status(200).json({
          statusCode: 200,
          message: "Reservation successful"
        });
      });
  
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  
  
  // static async getAllReservations(req: Request, res: Response) {
  //   try {
  //     const reservations = await ReservationService.getReservations();
  //     res.json(reservations);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // }

  static async getReservationsByHotelId(req: Request, res: Response) {
    try {
      const { hotelId } = req.params;

      // Validate hotelId
      if (!hotelId || isNaN(Number(hotelId))) {
        return res.status(400).json({ message: "Invalid hotelId provided." });
      }

      const reservations = await ReservationService.getReservationsByHotelId(Number(hotelId));

      if (reservations.length === 0) {
        return res
          .status(404)
          .json({ message: `No reservations found for hotel with ID ${hotelId}.` });
      }

      res.status(200).json(reservations);
    } catch (error) {
      console.error("Error fetching reservations by hotelId:", error.message);
      res.status(500).json({ error: error.message });
    }
  }
  
  

  static async getReservation(req: Request, res: Response) {
    const { id } = req.params;
    try {
      // Fetch the reservation with guest and billing details
      const reservation = await ReservationService.getReservationById(parseInt(id), ["guest", "billing"]);
  
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      // Format the response to include all relevant details
      res.status(200).json({
        reservationDetails: {
          ...reservation, // Includes reservation data
          guest: reservation.guest, // Associated guest details
          billing: reservation.billing, // Associated billing details
        },
      });
    } catch (err) {
      console.error("Error fetching reservation:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
  

 // Create
  static async updateReservation(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedReservation = await ReservationService.updateReservation(parseInt(id), req.body);
      if (!updatedReservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.json(updatedReservation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async deleteReservation(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const deleted = await ReservationService.deleteReservation(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getReservationStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { currentDate } = req.query;
    try {
      const reservation = await ReservationService.getReservationById(parseInt(id));
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
      const status = await ReservationService.determineStatus(reservation, new Date(currentDate as string));
      res.json(status);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static getActivityOptions(req: Request, res: Response): void {
    try {
      // Convert enum to an array of objects with label and value
      const ActivityOptions = Object.keys(ActivityType).map(key => {
        return {
          label: key.replace(/_/g, ' ').toUpperCase(), // Format the label (e.g., UNDER_MAINTENANCE -> Under Maintenance)
          value: ActivityType[key as keyof typeof ActivityType]  // Get the enum value
        };
      });

      // Send a response with the maintenance statuses
      res.status(200).json(ActivityOptions);

    } catch (error) {
      // Handle any errors and send a server error response
      res.status(500).json({ message: 'Error fetching activity options' });
    }
  }

  static async getActivityMetrics(req: Request, res: Response): Promise<void> {
    try {
      // Extract parameters from query string or request body (assuming GET request with query params)
      const { hotelId, createdAt, confirmedDate } = req.query;
  
      // Ensure createdAt and confirmedDate are valid dates if provided
      const createdAtDate = createdAt ? new Date(createdAt as string) : undefined;
      const confirmedDateDate = confirmedDate ? new Date(confirmedDate as string) : undefined;
  
      // Call the service method with extracted parameters
      const activityMetrics = await ReservationService.getActivityMetrics(
        hotelId as string,
        createdAtDate,
        confirmedDateDate
      );
  
      // Return the activity metrics as a JSON response
      res.status(200).json(activityMetrics);
    } catch (error) {
      console.error('Error fetching activity metrics:', error);
      res.status(500).json({ message: 'Error fetching activity metrics' });
    }
  }
  
}
