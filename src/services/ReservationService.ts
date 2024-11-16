// src/services/ReservationService.ts
import { AppDataSource } from '../data-source';
import { Reservation } from '../entities/ReservationEntity';
import { Guest } from '../entities/GuestEntity';
import { Room } from '../entities/RoomEntity';

export class ReservationService {
  private reservationRepository = AppDataSource.getRepository(Reservation);
  private guestRepository = AppDataSource.getRepository(Guest);
  private roomRepository = AppDataSource.getRepository(Room);

  async createReservation(checkInDate: Date, checkOutDate: Date, guestId: number, roomId: number, totalAmount: number) {
    const guest = await this.guestRepository.findOne({ where: { id: guestId } });
    const room = await this.roomRepository.findOne({ where: { id: roomId } });

    if (!guest) throw new Error('Guest not found');
    if (!room || !room.isAvailable) throw new Error('Room is not available');

    const reservation = this.reservationRepository.create({
      checkInDate,
      checkOutDate,
      guest,
      room,
      totalAmount,
      status: 'pending',
    });

    await this.reservationRepository.save(reservation);
    room.isAvailable = false; // Mark the room as unavailable
    await this.roomRepository.save(room);
    
    return reservation;
  }

  async getReservations() {
    return await this.reservationRepository.find({ relations: ['guest', 'room'] });
  }

  async updateReservationStatus(id: number, status: string) {
    const reservation = await this.reservationRepository.findOne({ where: { id } });

    if (!reservation) throw new Error('Reservation not found');

    reservation.status = status;
    await this.reservationRepository.save(reservation);
    return reservation;
  }
}
