import { AppDataSource } from '../data-source';
import { Guest } from '../entities/GuestEntity';

const guestRepository = AppDataSource.getRepository(Guest);

export class GuestService {
  
  // GuestService
  static async createGuest(guestDetails: Partial<Guest>) {
    const guest = guestRepository.create(guestDetails);
    await guestRepository.save(guest);
    return guest;
  }

  async getGuests() {
    return await guestRepository.find();
  }

  async getGuestById(id: number, relations: string[] = []): Promise<Guest | null> {
    const guestRepo = AppDataSource.getRepository(Guest);
  
    return guestRepo.findOne({
      where: { id },
      relations, // Dynamically include the specified relations
    });
  }



  static async findGuestByEmail(email: string): Promise<Guest | null> {
      try {
        const normalizedEmail = email.trim().toLowerCase();
        console.log(`Searching for guest with email: ${normalizedEmail}`); // Debugging
        return await guestRepository.findOne({ where: { email: normalizedEmail } });
      } catch (error) {
        console.error('Error finding guest by email:', error);
        throw new Error('Could not find guest by email');
      }
    }

  static async updateGuest(id: number, guestDetails: Partial<Guest>) {
    await guestRepository.update(id, guestDetails);
    const updatedGuest = await guestRepository.findOne({ where: { id } });
    if (!updatedGuest) {
      throw new Error('Guest not found');
    }
    return updatedGuest;
  }

  static async deleteGuest(id: number) {
    const result = await guestRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Guest not found');
    }
    return { message: 'Guest deleted successfully' };
  }
}
