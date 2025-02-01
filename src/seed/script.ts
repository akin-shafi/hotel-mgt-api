import { AppDataSource } from '../data-source';
import { Guest } from '../entities/GuestEntity';
import { Billing } from '../entities/BillingEntity';
import { Reservation,  } from '../entities/ReservationEntity';
import { ReservationType, BillingStatus, PaymentMethod, ReservationStatus } from '../constants';

// Sample guest data
const guests = [
  {
    fullName: 'John Doe',
    email: 'johndoe@email.com',
    phone: '123-456-7890',
    address: '123 Street, City, Country',
  },
  {
    fullName: 'Jane Smith',
    email: 'janesmith@email.com',
    phone: '987-654-3210',
    address: '456 Avenue, City, Country',
  },
];

// Sample billing data
const billings = [
  {
    amount: 100.50,
    status: BillingStatus.COMPLETE_PAYMENT,
    payment_method: PaymentMethod.POS_TERMINAL,
    due_date: new Date('2024-12-15'),
    billing_address: '123 Street, City, Country',
  },
  {
    amount: 200.75,
    status: BillingStatus.COMPLETE_PAYMENT,
    payment_method: PaymentMethod.BANK_TRANSFER,
    payment_date: new Date('2024-11-30'),
    billing_address: '456 Avenue, City, Country',
  },
];

// Sample reservation data
const reservations = [
  {
    guest: guests[0],
    checkInDate: new Date('2024-12-01'),
    checkOutDate: new Date('2024-12-05'),
    reservationType: ReservationType.WALK_IN, // Corrected to use enum value
    status: ReservationStatus.PENDING, // Corrected to use enum value
    activity: 'Arrival',
    paymentStatus: false,
    confirmed: false,
    specialRequest: ['Late check-in'],
    notes: 'Need an ocean view.',
    roomId: 101,
  },
  {
    guest: guests[1],
    checkInDate: new Date('2024-12-10'),
    checkOutDate: new Date('2024-12-15'),
    reservationType: ReservationType.ONLINE_RESERVATION, // Corrected to use enum value
    status: ReservationStatus.CONFIRMED, // Corrected to use enum value
    activity: 'In-House',
    paymentStatus: true,
    confirmed: true,
    specialRequest: ['Early check-in'],
    notes: 'Vegetarian meals preferred.',
    roomId: 202,
  },
];

async function seedData() {
  const guestRepository = AppDataSource.getRepository(Guest);
  const billingRepository = AppDataSource.getRepository(Billing);
  const reservationRepository = AppDataSource.getRepository(Reservation);

  // Insert guests
  const savedGuests = await guestRepository.save(guests);

  // Insert billings
  const savedBillings = await billingRepository.save(billings);

  // Insert reservations and associate them with guests and billings
  // const savedReservations = await reservationRepository.save(
  //   reservations.map((reservation, index) => ({
  //     ...reservation,
  //     guest: savedGuests[index],
  //     billing: [savedBillings[index]], // Associating billing data
  //   }))
  // );

  console.log('Sample data seeded successfully!');
}

seedData().catch((error) => console.log(error));
