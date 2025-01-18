"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const GuestEntity_1 = require("../entities/GuestEntity");
const BillingEntity_1 = require("../entities/BillingEntity");
const ReservationEntity_1 = require("../entities/ReservationEntity");
const BillingEntity_2 = require("../entities/BillingEntity");
const constants_1 = require("../constants");
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
        status: BillingEntity_2.BillingStatus.UNPAID,
        payment_method: BillingEntity_2.PaymentMethod.CREDIT_CARD,
        due_date: new Date('2024-12-15'),
        billing_address: '123 Street, City, Country',
    },
    {
        amount: 200.75,
        status: BillingEntity_2.BillingStatus.PAID,
        payment_method: BillingEntity_2.PaymentMethod.PAYPAL,
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
        reservationType: constants_1.ReservationType.WALK_IN, // Corrected to use enum value
        status: ReservationEntity_1.ReservationStatus.PENDING, // Corrected to use enum value
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
        reservationType: constants_1.ReservationType.ONLINE_BOOKING, // Corrected to use enum value
        status: ReservationEntity_1.ReservationStatus.CONFIRMED, // Corrected to use enum value
        activity: 'In-House',
        paymentStatus: true,
        confirmed: true,
        specialRequest: ['Early check-in'],
        notes: 'Vegetarian meals preferred.',
        roomId: 202,
    },
];
function seedData() {
    return __awaiter(this, void 0, void 0, function* () {
        const guestRepository = data_source_1.AppDataSource.getRepository(GuestEntity_1.Guest);
        const billingRepository = data_source_1.AppDataSource.getRepository(BillingEntity_1.Billing);
        const reservationRepository = data_source_1.AppDataSource.getRepository(ReservationEntity_1.Reservation);
        // Insert guests
        const savedGuests = yield guestRepository.save(guests);
        // Insert billings
        const savedBillings = yield billingRepository.save(billings);
        // Insert reservations and associate them with guests and billings
        // const savedReservations = await reservationRepository.save(
        //   reservations.map((reservation, index) => ({
        //     ...reservation,
        //     guest: savedGuests[index],
        //     billing: [savedBillings[index]], // Associating billing data
        //   }))
        // );
        console.log('Sample data seeded successfully!');
    });
}
seedData().catch((error) => console.log(error));
