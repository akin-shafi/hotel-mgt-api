// // src/routes.ts
// import { Router } from 'express';
// import { ReservationController } from '../controllers/ReservationController';
// import GuestController from '../controllers/GuestController';
// import { HousekeepingTaskController } from '../controllers/HousekeepingTaskController';
// import { BillingController } from '../controllers/BillingController';

// const router = Router();

// const reservationController = new ReservationController();
// // const guestController = new GuestController();
// const housekeepingTaskController = new HousekeepingTaskController();
// const billingController = new BillingController();

// // Reservation routes
// router.post('/reservations', reservationController.createReservation);
// router.get('/reservations', reservationController.getReservations);
// router.put('/reservations/status', reservationController.updateReservationStatus);

// // Guest routes
// router.post('/guests', guestController.createGuest);
// router.get('/guests', guestController.getGuests);
// router.get('/guests/:id', guestController.getGuestById);

// // Housekeeping task routes
// router.post('/housekeeping-tasks', housekeepingTaskController.createTask);
// router.get('/housekeeping-tasks', housekeepingTaskController.getTasks);
// router.put('/housekeeping-tasks/status', housekeepingTaskController.updateTaskStatus);

// // Billing routes
// router.post('/bills', billingController.createBill);
// router.put('/bills/:billId/pay', billingController.payBill);
// router.get('/bills', billingController.getBills);
// router.get('/bills/:billId', billingController.getBillById);

// export default router;
