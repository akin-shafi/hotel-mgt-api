import { Request, Response } from "express";
import { ReservationService } from "../services/ReservationService";
import { GuestService } from "../services/GuestService";
import { BillingService } from "../services/BillingService";
import { Guest } from "../entities/GuestEntity";
import { Billing } from "../entities/BillingEntity";
import { Reservation } from "../entities/ReservationEntity";
import { BookedRoom } from "../entities/BookedRoomEntity";
import { Room } from "../entities/RoomEntity";
import { Promotion } from "../entities/PromotionEntity";
import { AppDataSource } from '../data-source';
import { ActivityType, ReservationStatus, ReservationType, BillingStatus, MaintenanceStatus } from "../constants";

const reservationService = new ReservationService();

export class ReservationController {

  static async createReservation(req: Request, res: Response) {
    const { guestDetails, reservationDetails, createdBy, role, billingDetails } = req.body;

    try {
      const reservationRepo = AppDataSource.getRepository(Reservation);
      const bookedRoomRepo = AppDataSource.getRepository(BookedRoom);
      const promotionRepo = AppDataSource.getRepository(Promotion);
      const roomRepo = AppDataSource.getRepository(Room);

      // Find or create the guest
      let guest = await GuestService.findGuestByEmail(guestDetails[0].email);

      if (!guest) {
        console.log("Guest not found, creating a new guest.");
        guest = await GuestService.createGuest(guestDetails[0]);
        console.log("New guest created:", guest);
      }

      if (!guest || !guest.id) {
        console.log("Failed to create or retrieve guest.");
        return res.status(500).json({ error: "Failed to create or retrieve guest." });
      }

      // Check for existing reservation with the same guest and reservation dates
      const existingReservation = await reservationRepo.findOne({
        where: {
          guest: { id: guest.id },
          checkInDate: reservationDetails.checkInDate,
          checkOutDate: reservationDetails.checkOutDate,
        },
      });

      if (existingReservation) {
        return res.status(400).json({ error: "Reservation already exists for the same dates." });
      }

      // Validate reservation type and status using enums
      if (!Object.values(ReservationType).includes(reservationDetails.reservationType)) {
        return res.status(400).json({ error: "Invalid reservation type." });
      }

      if (!Object.values(ReservationStatus).includes(reservationDetails.reservationStatus)) {
        return res.status(400).json({ error: "Invalid reservation status." });
      }

      await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        // Create a new reservation linked to the guest
        const newReservation = transactionalEntityManager.create(Reservation, {
          ...reservationDetails,
          guest,
          createdBy,
          role,
          activity: reservationDetails.reservationStatus === ReservationStatus.CONFIRMED ? ActivityType.CHECK_IN : ActivityType.PENDING_ARRIVAL,
          totalBalance: billingDetails.balance,
          totalPaid: billingDetails.amountPaid,
          grandTotal: billingDetails.grandTotal,
        });

        // Save the reservation first to ensure it has an ID for association
        const savedReservation = await transactionalEntityManager.save(newReservation);

        // console.log("Reservation created:", savedReservation);

        // Create booked rooms linked to the saved reservation
        await Promise.all(reservationDetails.rooms.map(async (room) => {
          const roomEntity = await transactionalEntityManager.findOne(Room, { where: { roomName: room.roomName, hotelId: reservationDetails.hotelId } });
          if (roomEntity) {
            const bookedRoom = transactionalEntityManager.create(BookedRoom, {
              reservation: savedReservation,
              room: roomEntity,
              numberOfAdults: room.numberOfAdults,
              numberOfChildren: room.numberOfChildren,
              roomPrice: room.roomPrice,
              roomName: room.roomName,
            });
            await transactionalEntityManager.save(bookedRoom);

            // Update the room's maintenance status to OCCUPIED
            roomEntity.maintenanceStatus = MaintenanceStatus.OCCUPIED;
            await transactionalEntityManager.save(roomEntity);
            // console.log("Booked room saved and status updated:", bookedRoom);
          }
        }));

        // Determine billing status
        const billingStatus = billingDetails.grandTotal > billingDetails.amountPaid ? BillingStatus.PART_PAYMENT : BillingStatus.COMPLETE_PAYMENT;

        // Create the new billing linked to the saved reservation
        const newBilling = transactionalEntityManager.create(Billing, {
          ...billingDetails,
          reservation: savedReservation,
          status: billingStatus,
        });

        // Save the billing details
        const savedBilling = await transactionalEntityManager.save(newBilling);

        // Update the promotion record if a discount code is used
        if (billingDetails.discountCode) {
          const promotion = await promotionRepo.findOne({ where: { code: billingDetails.discountCode } });
          if (promotion) {
            promotion.status = "used";
            promotion.usedBy = guestDetails[0].email;
            promotion.usedFor = `Reservation ID: ${savedReservation.id}`;
            await transactionalEntityManager.save(promotion);
            // console.log("Promotion updated:", promotion);
          }
        }

        // Send response with the new reservation and billing details
        res.status(200).json({
          statusCode: 200,
          reservationId: savedReservation.id,
          message: "Reservation successful",
        });
      });
    } catch (error) {
      console.error("Error creating reservation:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  
  static async getReservationsByHotelId(req: Request, res: Response) {
    try {
      const { hotelId } = req.params;

      // Validate hotelId
      if (!hotelId || isNaN(Number(hotelId))) {
        return res.status(400).json({ message: "Invalid hotelId provided." });
      }

      const reservations = await ReservationService.getReservationsByHotelId(Number(hotelId));

      if (reservations.length === 0) {
        return res.status(200).json([]);
      }

      res.status(200).json(reservations);
    } catch (error) {
      console.error("Error fetching reservations by hotelId:", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  static async getReservation(req, res) {
    const { reservationId } = req.params;
  
    // Check if the id parameter is a valid integer
    if (isNaN(parseInt(reservationId))) {
      return res.status(400).json({ message: "Invalid reservation ID" });
    }
  
    try {
      // Fetch the reservation with guest and billing details
      const reservation = await ReservationService.getReservationById(parseInt(reservationId), ["guest", "billing", "bookedRooms", "bookedRooms.room"]);
  
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      // Format the response to include all relevant details
      res.status(200).json({reservation});
    } catch (err) {
      console.error("Error fetching reservation:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
  

 // Create
 static async updateReservation(req: Request, res: Response) {
  const { id } = req.params;
  const data = { ...req.body };
  
  try {
    const updatedReservation = await ReservationService.updateReservation(parseInt(id), data);
    
    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (data.activity === ActivityType.CHECK_OUT) {
      const roomRepo = AppDataSource.getRepository(Room);
      await Promise.all(data.rooms.map(async (room) => {
        const roomEntity = await roomRepo.findOne({ where: { id: room.id } });
        if (roomEntity) {
          roomEntity.maintenanceStatus = MaintenanceStatus.AVAILABLE;
          await roomRepo.save(roomEntity);
        }
      }));
    }

    res.json(updatedReservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


  static async addPayment(req: Request, res: Response) {
    const { reservationId, amountPaid, paymentMethod } = req.body;

    try {
      await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const reservationRepo = transactionalEntityManager.getRepository(Reservation);

        // Find the reservation
        const reservation = await reservationRepo.findOne({
          where: { id: reservationId },
          relations: ["billing", "guest"], // Ensure "guest" is included
        });

        if (!reservation) {
          return res.status(404).json({ error: "Reservation not found" });
        }

        // Convert numeric fields from string to number
        const totalPaid = Number(reservation.totalPaid) || 0;
        const grandTotal = Number(reservation.grandTotal) || 0;
        const newAmountPaid = Number(amountPaid) || 0;

        // Calculate new totalPaid and balance
        const updatedTotalPaid = totalPaid + newAmountPaid;
        let updatedBalance = grandTotal - updatedTotalPaid;

        // Prevent negative balance
        if (updatedBalance < 0) {
          updatedBalance = 0;
        }

        // Update Reservation table
        reservation.totalPaid = updatedTotalPaid;
        reservation.totalBalance = updatedBalance;

        // Save updated reservation
        const savedReservation = await reservationRepo.save(reservation);
        console.log("Reservation Updated:", savedReservation);

        // Ensure guest exists
        const guestName = reservation.guest?.fullName || "Unknown Guest";

        // Use the BillingService to create a new billing entry
        const newBilling = await BillingService.createBill({
          amountPaid: newAmountPaid,
          payment_method: paymentMethod,
          balance: updatedBalance,
          billTo: guestName,
          reservation: savedReservation, // Pass the updated reservation object
        });
        // console.log("Billing Created:", newBilling);

        res.status(200).json({
          statusCode: 200,
          message: "Payment added successfully",
          totalPaid: updatedTotalPaid.toFixed(2),
          totalBalance: updatedBalance.toFixed(2),
        });
      });
    } catch (error) {
      console.error("Error adding payment:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }


  static async exchangeRoom(req: Request, res: Response) {
    const {
      reservationId,
      roomId,
      roomName,
      checkOutDate,
      roomPrice,
      grandTotal,
      updatedAt,
    } = req.body;

    try {
      await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
        const reservationRepo = transactionalEntityManager.getRepository(Reservation);
        const bookedRoomRepo = transactionalEntityManager.getRepository(BookedRoom);

        // Find the reservation
        const reservation = await reservationRepo.findOne({
          where: { id: reservationId },
          relations: ["bookedRooms"], // Ensure "bookedRooms" is included
        });

        if (!reservation) {
          return res.status(404).json({ error: "Reservation not found" });
        }

        // Update the reservation details
        reservation.checkOutDate = checkOutDate;
        reservation.grandTotal = grandTotal;
        reservation.updatedAt = new Date(updatedAt);

        // Update the booked room details
        const bookedRoom = reservation.bookedRooms[0];
        bookedRoom.room = roomId;
        bookedRoom.roomName = roomName;
        bookedRoom.roomPrice = roomPrice;

        // Save updated reservation and booked room
        // console.log("reservation:", reservation);
        // console.log("bookedRoom:", bookedRoom);
        await reservationRepo.save(reservation);
        await bookedRoomRepo.save(bookedRoom);

        res.status(200).json({
          statusCode: 200,
          message: "Room exchanged successfully",
          reservation,
          bookedRoom,
        });
      });
    } catch (error) {
      console.error("Error exchanging room:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
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
