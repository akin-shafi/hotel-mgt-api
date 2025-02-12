import { AppDataSource } from "../data-source"; // Your database connection
import { Reservation } from "../entities/ReservationEntity";
import { BookedRoom } from '../entities/BookedRoomEntity';
import { Billing } from '../entities/BillingEntity';
import { Repository, In, Between } from "typeorm";
import {ActivityType, ReservationStatus, ReservationType } from "../constants"
import { Room } from "../entities/RoomEntity";

let reservationRepository: Repository<Reservation>;

export class ReservationService {

  constructor() {
    reservationRepository = AppDataSource.getRepository(Reservation);
  }

  static async getReservations(): Promise<Reservation[]> {
    return await reservationRepository.find();
  }

  static async getActivityMetrics(
    hotelId: string,
    createdAt?: Date,
    confirmedDate?: Date
  ): Promise<{ label: string; value: number; key: string }[]> { 
    try {
      const reservationRepo = AppDataSource.getRepository(Reservation);
  
      // Build the where condition dynamically based on the provided filters
      const whereCondition: any = {
        hotelId, // Always filter by hotelId
      };
  
      // Conditionally add createdAt filter
      if (createdAt) {
        whereCondition.createdAt = createdAt;
      }
  
      // Conditionally add confirmedDate filter
      if (confirmedDate) {
        whereCondition.confirmedDate = confirmedDate;
      }
  
      // Query reservations for totals based on activity and filters
      const activityMetrics = await Promise.all(
        Object.entries(ActivityType).map(async ([key, label]) => {
          const activityKey = key as keyof typeof ActivityType; // Cast key to keyof Activity
          const totalCount = await reservationRepo.count({
            where: {
              activity: ActivityType[activityKey], // Use the Activity enum value
              ...whereCondition, // Add the dynamically built where condition
            },
          });
  
          return {
            label,
            value: totalCount,
            key: key.toLowerCase(), // Format key in lowercase (e.g., ARRIVAL -> arrival)
          };
        })
      );
  
      return activityMetrics;
    } catch (error) {
      console.error('Error calculating activity metrics:', error);
      throw new Error('Error calculating activity metrics');
    }
  }
  
  static async getReservationsByHotelId(hotelId: number): Promise<any[]> {
    try {
      // Fetch reservations by hotelId
      const reservations = await reservationRepository.find({
        where: { hotel: { id: hotelId } },
        relations: ["guest", "billing", "hotel", "bookedRooms", "bookedRooms.room"], // Include related entities
        order: { id: "DESC" } // Sort by id in descending order
      });
  
      const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      });
      // Map reservations to the desired structure
      const guests = reservations.map((reservation) => {
        const checkInDate = new Date(reservation.checkInDate);
        const checkOutDate = new Date(reservation.checkOutDate);
        const dates = `${checkInDate.toLocaleDateString('en-US')} - ${checkOutDate.toLocaleDateString('en-US')}`;
        const createdAt = reservation.createdAt;
        const formattedDate = new Date(createdAt).toISOString().split('T')[0];
  
        // Aggregate the details of booked rooms
        const roomDetails = reservation.bookedRooms.map(bookedRoom => ({
          roomName: bookedRoom.room.roomName,
          numberOfAdults: bookedRoom.numberOfAdults,
          numberOfChildren: bookedRoom.numberOfChildren,
          roomPrice: bookedRoom.roomPrice,
        }));
  
        return {
          id: reservation.id.toString(),
          name: reservation.guest.fullName,
          rooms: roomDetails,
          dates: dates,
          email: reservation.guest.email,
          phone: reservation.guest.phone,
          specialRequests: reservation.specialRequest ? reservation.specialRequest.join(", ") : "", // Join array as comma-separated string or default to empty string
          notes: reservation.notes || '', // If notes are available
          status: reservation.reservationStatus,
          activity: reservation.activity || 'arrivals', // Default to 'arrivals' if activity is not specified
          billing: reservation.billing,
          totalBalance: reservation.totalBalance,
          totalPaid: reservation.totalPaid,
          grandTotal: reservation.grandTotal,
          createdAt: formattedDate
        };
      });
      // console.log("Test 1", guests);
      return guests;
    } catch (error) {
      console.error("Error fetching reservations by hotelId:", error.message);
      throw error;
    }
  }

  static async getReservationById(id: number, relations: string[] = []): Promise<any | null> {
    try {
      const reservationRepo = AppDataSource.getRepository(Reservation);
      const reservation = await reservationRepo.findOne({
        where: { id },
        relations, // Dynamically include the specified relations
      });
  
      if (!reservation) {
        return null;
      }

      const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
      });
  
      const checkInDate = new Date(reservation.checkInDate);
      const checkOutDate = new Date(reservation.checkOutDate);
      const numberOfNights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
  
      // Aggregate the details of booked rooms
      const roomDetails = reservation.bookedRooms.map(bookedRoom => ({
        roomName: bookedRoom.room.roomName,
        numberOfAdults: bookedRoom.numberOfAdults,
        numberOfChildren: bookedRoom.numberOfChildren,
        roomPrice: bookedRoom.roomPrice,
      }));
      
      // console.log("roomDetails", roomDetails);
      // reservationDetails: {
      //   id: reservation.id,
      //   checkInDate: reservation.checkInDate,
      //   checkOutDate: reservation.checkOutDate,
      //   hotelId: reservation.hotelId,
      //   activity: reservation.activity,
      //   reservationType: reservation.reservationType,
      //   reservationStatus: reservation.reservationStatus,
      //   paymentStatus: reservation.paymentStatus,
      //   totalBalance: reservation.totalBalance,
      //   totalPaid: reservation.totalPaid,
      //   grandTotal: reservation.grandTotal,
      //   createdBy: reservation.createdBy,
      //   numberOfNights: reservation.numberOfNights,
      //   role: reservation.role,
      //   createdAt: reservation.createdAt,
      //   updatedAt: reservation.updatedAt,
      //   specialRequest: reservation.specialRequest,
      //   notes: reservation.notes,
      //   confirmedDate: reservation.confirmedDate,
      //   guest: reservation.guest, // Associated guest details
      //   billing: reservation.billing, // Associated billing details
      //   bookedRooms: reservation.bookedRooms.map(room => ({
      //     id: room.id,
      //     roomName: room.roomName,
      //     numberOfAdults: room.numberOfAdults,
      //     numberOfChildren: room.numberOfChildren,
      //     roomPrice: room.roomPrice
      //   }))
      // }
      const formattedReservation = {
        id: reservation.id.toString(),
        checkInDate: reservation.checkInDate,
        checkOutDate: reservation.checkOutDate,
        hotelId: reservation.hotelId,
        activity: reservation.activity,
        reservationType: reservation.reservationType,
        reservationStatus: reservation.reservationStatus,
        paymentStatus: reservation.paymentStatus,
        totalBalance: reservation.totalBalance,
        totalPaid: reservation.totalPaid,
        grandTotal: reservation.grandTotal,
        createdBy: reservation.createdBy,
        numberOfNights: numberOfNights,
        nightSpent: reservation.nightSpent,
        role: reservation.role,
        createdAt: reservation.createdAt,
        updatedAt: reservation.updatedAt,
        specialRequest: reservation.specialRequest,
        notes: reservation.notes,
        confirmedDate: reservation.confirmedDate,
        guest: reservation.guest,
        billing: reservation.billing,
        bookedRooms: roomDetails,
      };
  
      // console.log("Test 2", formattedReservation);

      return formattedReservation;
    } catch (error) {
      console.error("Error fetching reservation by id:", error.message);
      throw error;
    }
  }
  
    /**
   * Fetch multiple reservations by their IDs.
   * @param ids - An array of reservation IDs
   * @returns A promise that resolves to an array of reservations
   */
  static async getReservationsByIds(ids: number[]): Promise<Reservation[]> {
      return await reservationRepository.find({
        where: { id: In(ids) },
      });
  }

  static async getADR(hotelId: number, date: Date) {
    const reservationRepository = AppDataSource.getRepository(Reservation);

    // Ensure the query focuses on the date only
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Query the reservation repository to get reservations within the date range
    const reservations = await reservationRepository.find({
      where: {
        hotelId,
        updatedAt: Between(startOfDay, endOfDay),
      },
      relations: ['bookedRooms', 'bookedRooms.room'],
    });

    if (!reservations || reservations.length === 0) {
      console.log('No reservations found for the specified date range and hotel');
      return { totalRevenue: 0, roomsSold: 0, adr: 0 }; // No reservations, return default values
    }

    console.log('Reservations:', reservations);

    // Filter out complimentary rooms and staff rooms
    const saleableReservations = reservations.filter(reservation => 
      reservation.bookedRooms.some(bookedRoom => bookedRoom.room && !bookedRoom.room.isComplimentary && !bookedRoom.room.isStaffRoom)
    );

    console.log('Saleable Reservations:', saleableReservations);

    if (saleableReservations.length === 0) {
      console.log('No saleable reservations found');
      return { totalRevenue: 0, roomsSold: 0, adr: 0 }; // No saleable reservations, return default values
    }

    // Calculate total revenue and number of rooms sold
    const totalRevenue = saleableReservations.reduce((acc, reservation) => {
      const roomRevenue = reservation.bookedRooms.reduce((roomAcc, bookedRoom) => {
        return roomAcc + parseFloat(bookedRoom.roomPrice.toString());
      }, 0);
      return acc + roomRevenue;
    }, 0);

    console.log('Total Revenue:', totalRevenue);

    const roomsSold = saleableReservations.reduce((acc, reservation) => acc + reservation.bookedRooms.length, 0);

    console.log('Rooms Sold:', roomsSold);

    // Calculate ADR
    const adr = roomsSold > 0 ? totalRevenue / roomsSold : 0;

    console.log(`ADR: ${adr}`);

    return { totalRevenue, roomsSold, adr };
  }

  static async getDueOutReservations(hotelId: number, checkOutDate: Date) {
    const reservationRepository = AppDataSource.getRepository(Reservation);

    const startOfDay = new Date(checkOutDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(checkOutDate);
    endOfDay.setHours(23, 59, 59, 999);

    const dueOutReservations = await reservationRepository.find({
      where: {
        hotelId,
        checkOutDate: Between(startOfDay, endOfDay),
      },
      relations: ['guest', 'bookedRooms', 'bookedRooms.room'],
    });

    return dueOutReservations;
  }

  static async getReservationsByStatus(hotelId: number, date: Date, status: ActivityType) {
    const reservationRepository = AppDataSource.getRepository(Reservation);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await reservationRepository.find({
      where: {
        hotelId,
        updatedAt: Between(startOfDay, endOfDay),
        activity: status
      },
      relations: ['guest', 'bookedRooms', 'bookedRooms.room'],
    });

    return reservations;
  }

  static async countReservationsByStatus(hotelId: number, date: Date) {
    const reservationRepository = AppDataSource.getRepository(Reservation);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const dueOutCount = await reservationRepository.count({
      where: {
        hotelId,
        checkOutDate: Between(startOfDay, endOfDay),
        activity: ActivityType.CHECK_IN,
      },
    });

    const pendingArrivalCount = await reservationRepository.count({
      where: {
        hotelId,
        checkInDate: Between(startOfDay, endOfDay),
        activity: ActivityType.PENDING_ARRIVAL,
      },
    });

    return { dueOutCount, pendingArrivalCount };
  }

  static async getTotalOutstandingBalance(hotelId: number, date: Date) {
    const reservationRepository = AppDataSource.getRepository(Reservation);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const reservations = await reservationRepository.find({
      where: {
        hotelId,
        updatedAt: Between(startOfDay, endOfDay),
      },
    });

    const totalOutstandingBalance = reservations.reduce((acc, reservation) => {
      return acc + parseFloat(reservation.totalBalance.toString());
    }, 0);

    return totalOutstandingBalance;
  }

  static async getYearlyRevenue(hotelId: number, year: number) {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    
    // Initialize an array to hold the monthly revenue data
    const monthlyRevenue = new Array(12).fill(0);

    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);

      const reservations = await reservationRepository.find({
        where: {
          hotelId,
          updatedAt: Between(startOfMonth, endOfMonth),
        },
      });

      const totalRevenue = reservations.reduce((acc, reservation) => {
        return acc + parseFloat(reservation.totalBalance.toString());
      }, 0);

      monthlyRevenue[month] = totalRevenue;
    }

    return monthlyRevenue;
  }

  static async getYearlyOccupancyAndADR(hotelId: number, year: number) {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const roomRepository = AppDataSource.getRepository(Room);

    // Initialize arrays to hold the monthly occupancy rate and ADR data
    const monthlyOccupancy = new Array(12).fill(0);
    const monthlyADR = new Array(12).fill(0);

    // Calculate monthly data
    for (let month = 0; month < 12; month++) {
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);

      const reservations = await reservationRepository.find({
        where: {
          hotelId,
          updatedAt: Between(startOfMonth, endOfMonth),
        },
        relations: ['bookedRooms', 'bookedRooms.room'],
      });

      const totalRooms = await roomRepository.count({
        where: { hotelId },
      });

      const saleableReservations = reservations.filter(reservation =>
        reservation.bookedRooms.some(bookedRoom => bookedRoom.room && !bookedRoom.room.isComplimentary && !bookedRoom.room.isStaffRoom)
      );

      const roomsSold = saleableReservations.reduce((acc, reservation) => acc + reservation.bookedRooms.length, 0);

      const totalRevenue = saleableReservations.reduce((acc, reservation) => {
        const roomRevenue = reservation.bookedRooms.reduce((roomAcc, bookedRoom) => {
          return roomAcc + parseFloat(bookedRoom.roomPrice.toString());
        }, 0);
        return acc + roomRevenue;
      }, 0);

      // Calculate occupancy rate
      monthlyOccupancy[month] = totalRooms > 0 ? (roomsSold / totalRooms) * 100 : 0;

      // Calculate ADR
      monthlyADR[month] = roomsSold > 0 ? totalRevenue / roomsSold : 0;
    }

    return { monthlyOccupancy, monthlyADR };
  }


  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    const newReservation = reservationRepository.create(data);
    return await reservationRepository.save(newReservation);
  }

  static async updateReservation(id: number, data: Partial<Reservation>) {
    const reservation = await reservationRepository.findOne({
      where: { id }
    });

    if (!reservation) return null;
    Object.assign(reservation, data);
    return await reservationRepository.save(reservation);
  }

  static async deleteReservation(id: number): Promise<boolean> {
    const reservationRepository = AppDataSource.getRepository(Reservation);
    const bookedRoomRepository = AppDataSource.getRepository(BookedRoom);
    const billingRepository = AppDataSource.getRepository(Billing);

    const reservation = await reservationRepository.findOne({ where: { id } });

    if (!reservation) {
      return false;
    }

    await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
      // Delete related booked rooms
      await transactionalEntityManager.delete(BookedRoom, { reservation });

      // Delete related billing records
      await transactionalEntityManager.delete(Billing, { reservation });

      // Delete the reservation itself
      await transactionalEntityManager.delete(Reservation, { id });
    });

    return true;
  }


  static async determineStatus(reservation: Reservation, currentDate: Date): Promise<{ activity: string; cta: string[] }> {
    const today = new Date(currentDate);
    const checkInDate = new Date(reservation.checkInDate);
    const checkOutDate = new Date(reservation.checkOutDate);

    if (reservation.activity === ActivityType.CANCELLED) {
      return { activity: "Cancellation", cta: ["Confirm Cancellation", "Reject Cancellation"] };
    }

    if (reservation.reservationType === ReservationType.ONLINE_RESERVATION && reservation.reservationStatus === ReservationStatus.CONFIRMED) {
      return { activity: "Bookings", cta: ["Confirm"] };
    }

    if (today.toDateString() === checkInDate.toDateString()) {
      return { activity: "Arrival", cta: ["Check-In"] };
    }

    if (today.toDateString() === checkOutDate.toDateString()) {
      return { activity: "Departure", cta: ["Check-Out"] };
    }

    if (today > checkInDate && today < checkOutDate) {
      return { activity: "In-House", cta: ["Manage Stay"] };
    }

    return { activity: "Unknown", cta: [] };
  }
}
