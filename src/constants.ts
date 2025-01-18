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
  ARRIVAL = 'Arrival',
  CHECK_IN = 'Check-in',
  CHECK_OUT = 'Check-out',
  DUE_OUT = 'Due-out',
  BOOKINGS = 'Booking',
  CANCELLATION = 'Cancelled',
}

// Enum for reservation type
export enum ReservationType {
  WALK_IN = 'Walk-in',
  ONLINE_BOOKING = 'Online-Booking',
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}