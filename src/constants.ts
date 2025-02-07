// src/constants.ts

export enum UserRole {
  Admin = 'admin',                 // Full access to manage users, settings, and all operations
  FrontDesk = 'front-desk',         // Handles reservations, check-in/check-out, guest management
  Finance = 'finance',              // Manages billing, invoices, and financial records
  Housekeeping = 'housekeeping',    // Manages room maintenance and housekeeping tasks
  Maintenance = 'maintenance',      // Handles room repairs and general maintenance tasks
  Manager = 'manager',              // Oversees operations and reporting, access to high-level data
  GuestRelations = 'guest-relations' // Manages guest satisfaction, handles requests, and feedback
}

  
export enum AccountStatus {
  Active = 'active',
  Inactive = 'inactive',
  Suspended = 'suspended'
}

  export enum OnboardingStatus {
    InvitationSent = "Invitation Sent",
    OnboardingNotCompleted = "Onboarding not Completed",
    OnboardingCompleted = "Onboarding Completed",
    Approved = "Approved",
  }


  export enum MaintenanceStatus {
    CLEAN = 'clean',
    DIRTY = 'dirty',
    UNDER_MAINTENANCE = 'under_maintenance',
    OUT_OF_ORDER = 'out_of_order',
    SCHEDULED_FOR_CLEANING = 'scheduled_for_cleaning',
    SCHEDULED_FOR_MAINTENANCE = 'scheduled_for_maintenance',
    IN_USE = 'in_use',
  }

  // Enum for reservation status
export enum ActivityType {
  PENDING_ARRIVAL = 'pending_arrival',
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
  DUE_OUT = 'due-out',
  BOOKINGS = 'booking',
  REQUEST_CANCELLATION = 'request_cancellation',
  CANCELLED = 'cancelled',

}

// Enum for reservation type
export enum ReservationType {
  WALK_IN = 'walk_in',
  ONLINE_RESERVATION = 'online_reservation',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  TRANSACTION_COMPLETED = 'transaction_completed',
}


// Enum for the billing status
export enum BillingStatus {
  COMPLETE_PAYMENT = 'complete_payment',
  PART_PAYMENT = 'part_payment',
  REQUEST_REFUND = 'request_refund',
  REFUNDED = 'refunded',
}

// Enum for the payment method
export enum PaymentMethod {
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer',
  POS_TERMINAL = 'pos_terminal',
  OTHERS = 'others',
}


