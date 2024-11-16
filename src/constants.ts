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
