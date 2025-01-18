"use strict";
// src/constants.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationStatus = exports.ReservationType = exports.ActivityType = exports.MaintenanceStatus = exports.OnboardingStatus = exports.AccountStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Admin"] = "admin";
    UserRole["FrontDesk"] = "front-desk";
    UserRole["Finance"] = "finance";
    UserRole["Housekeeping"] = "housekeeping";
    UserRole["Maintenance"] = "maintenance";
    UserRole["Manager"] = "manager";
    UserRole["GuestRelations"] = "guest-relations"; // Manages guest satisfaction, handles requests, and feedback
})(UserRole || (exports.UserRole = UserRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["Active"] = "active";
    AccountStatus["Inactive"] = "inactive";
    AccountStatus["Suspended"] = "suspended";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var OnboardingStatus;
(function (OnboardingStatus) {
    OnboardingStatus["InvitationSent"] = "Invitation Sent";
    OnboardingStatus["OnboardingNotCompleted"] = "Onboarding not Completed";
    OnboardingStatus["OnboardingCompleted"] = "Onboarding Completed";
    OnboardingStatus["Approved"] = "Approved";
})(OnboardingStatus || (exports.OnboardingStatus = OnboardingStatus = {}));
var MaintenanceStatus;
(function (MaintenanceStatus) {
    MaintenanceStatus["CLEAN"] = "clean";
    MaintenanceStatus["DIRTY"] = "dirty";
    MaintenanceStatus["UNDER_MAINTENANCE"] = "under_maintenance";
    MaintenanceStatus["OUT_OF_ORDER"] = "out_of_order";
    MaintenanceStatus["SCHEDULED_FOR_CLEANING"] = "scheduled_for_cleaning";
    MaintenanceStatus["SCHEDULED_FOR_MAINTENANCE"] = "scheduled_for_maintenance";
    MaintenanceStatus["IN_USE"] = "in_use";
})(MaintenanceStatus || (exports.MaintenanceStatus = MaintenanceStatus = {}));
// Enum for reservation status
var ActivityType;
(function (ActivityType) {
    ActivityType["ARRIVAL"] = "Arrival";
    ActivityType["CHECK_IN"] = "Check-in";
    ActivityType["CHECK_OUT"] = "Check-out";
    ActivityType["DUE_OUT"] = "Due-out";
    ActivityType["BOOKINGS"] = "Booking";
    ActivityType["CANCELLATION"] = "Cancelled";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
// Enum for reservation type
var ReservationType;
(function (ReservationType) {
    ReservationType["WALK_IN"] = "Walk-in";
    ReservationType["ONLINE_BOOKING"] = "Online-Booking";
})(ReservationType || (exports.ReservationType = ReservationType = {}));
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "pending";
    ReservationStatus["CONFIRMED"] = "confirmed";
    ReservationStatus["CANCELLED"] = "cancelled";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
