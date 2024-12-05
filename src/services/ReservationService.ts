import { AppDataSource } from "../data-source"; // Your database connection
import { Reservation } from "../entities/ReservationEntity";
import { Repository, In } from "typeorm";
import {Activity, ReservationType } from "../constants"

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
        Object.entries(Activity).map(async ([key, label]) => {
          const activityKey = key as keyof typeof Activity; // Cast key to keyof Activity
          const totalCount = await reservationRepo.count({
            where: {
              activity: Activity[activityKey], // Use the Activity enum value
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
  
  

  // static async getReservationsByHotelId(hotelId: number): Promise<Reservation[]> {
  //   return await reservationRepository.find({
  //     where: { hotel: { id: hotelId } }, // Assuming a Many-to-One relation between Reservation and Hotel
  //     relations: ["guest", "billing", "hotel"], // Include related entities
  //   });
  // }

  static async getReservationsByHotelId(hotelId: number): Promise<any[]> {
    // Fetch reservations by hotelId
    const reservations = await reservationRepository.find({
      where: { hotel: { id: hotelId } }, // Assuming a Many-to-One relation between Reservation and Hotel
      relations: ["guest", "billing", "hotel"], // Include related entities
    });
  
    // Map reservations to the desired structure
    const guests = reservations.map((reservation) => {
      // Calculate the number of nights
      const checkInDate = new Date(reservation.checkInDate);
      const checkOutDate = new Date(reservation.checkOutDate);
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
  
      // Format the dates as "MM/DD/YY - MM/DD/YY"
      const dates = `${checkInDate.toLocaleDateString('en-US')} - ${checkOutDate.toLocaleDateString('en-US')}`;
  
      return {
        id: reservation.id.toString(),
        name: reservation.guest.fullName,
        room: reservation.roomName,
        dates: dates,
        nights: nights,
        guests: reservation.adults + reservation.children, // Sum of adults and children
        beds: reservation.beds || 1, // Assuming at least 1 bed if none specified
        email: reservation.guest.email,
        phone: reservation.guest.phone,
        specialRequests: reservation.specialRequest.join(", "), // Join array as comma-separated string
        notes: reservation.notes || '', // If notes are available
        status: reservation.status,
        activity: reservation.activity || 'arrivals', // Default to 'arrivals' if activity is not specified
      };
    });
  
    return guests;
  }

  static async getReservationById(id: number, relations: string[] = []): Promise<Reservation | null> {
    const reservationRepo = AppDataSource.getRepository(Reservation);
  
    return reservationRepo.findOne({
      where: { id },
      relations, // Dynamically include the specified relations
    });
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

    
  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    const newReservation = reservationRepository.create(data);
    return await reservationRepository.save(newReservation);
  }

  static async updateReservation(id: number, data: Partial<Reservation>): Promise<Reservation | null> {
    const reservation = await ReservationService.getReservationById(id);
    if (!reservation) return null;
    Object.assign(reservation, data);
    return await reservationRepository.save(reservation);
  }

  static async deleteReservation(id: number): Promise<boolean> {
    const result = await reservationRepository.delete(id);
    return result.affected === 1;
  }

  static async determineStatus(reservation: Reservation, currentDate: Date): Promise<{ activity: string; cta: string[] }> {
    const today = new Date(currentDate);
    const checkInDate = new Date(reservation.checkInDate);
    const checkOutDate = new Date(reservation.checkOutDate);

    if (reservation.activity === Activity.CANCELLATION) {
      return { activity: "Cancellation", cta: ["Confirm Cancellation", "Reject Cancellation"] };
    }

    if (reservation.reservationType === ReservationType.ONLINE_BOOKING && !reservation.confirmed) {
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
