// hotelService.ts
import { AppDataSource } from '../data-source';
import { Hotel } from '../entities/HotelEntity';

const hotelRepository = AppDataSource.getRepository(Hotel);

export class HotelService {

  // Create a new hotel
  static async create(hotelData: Partial<Hotel>): Promise<Hotel> {
    const user = hotelRepository.create(hotelData);
    return hotelRepository.save(user);
  }

  static async update(tenantId: string, data: Partial<Hotel>): Promise<Hotel | null> {
    await hotelRepository.update({ tenantId }, data);
    return await hotelRepository.findOneBy({ tenantId });
  }

  static async generateTenantId(name: string): Promise<string> {
    const uniqueSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0'); // Ensure two digits
    return `${name.replace(/\s+/g, '_').toLowerCase()}_${uniqueSuffix}`;  // Generates tenantId based on name and suffix
  }
  // Get all hotels
  static async getAllHotels(): Promise<Hotel[]> {
    return await hotelRepository.find();
  }

  // Get a hotel by ID
  static async getHotelById(id: number): Promise<Hotel | null> {
    return await hotelRepository.findOne({where: {id}});
  }

  static async getHotelByEmail(email: string): Promise<Hotel | null> {
    return await hotelRepository.findOne({where: {email}});
  }

  // Get a hotel by tenantId
  static async getHotelByTenantId(tenantId: string): Promise<Hotel | null> {
    return await hotelRepository.findOne({ where: { tenantId } });
  }

  // Update a hotel
  static async updateHotel(id: number, updateData: Partial<Hotel>): Promise<Hotel | null> {
    const hotel = await hotelRepository.findOne({where: {id}});
    if (!hotel) return null;
    
    hotelRepository.merge(hotel, updateData);
    return await hotelRepository.save(hotel);
  }

  // Delete a hotel
  static async deleteHotel(id: number): Promise<boolean> {
    const result = await hotelRepository.delete(id);
    return result.affected > 0;
  }
}

