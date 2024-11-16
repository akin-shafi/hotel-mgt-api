
import { AppDataSource } from '../data-source';
import { Guest } from '../entities/GuestEntity';

export class GuestService {
  private guestRepository = AppDataSource.getRepository(Guest);

  async createGuest(fullName: string, email: string, phone: string, address: string) {
    const guest = this.guestRepository.create({ fullName, email, phone, address });
    await this.guestRepository.save(guest);
    return guest;
  }

  async getGuests() {
    return await this.guestRepository.find();
  }

  async getGuestById(id: number) {
    return await this.guestRepository.findOne({ where: { id } });
  }
  
}
