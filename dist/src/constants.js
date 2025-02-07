"use strict";
// src/constants.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.BillingStatus = exports.ReservationStatus = exports.ReservationType = exports.ActivityType = exports.MaintenanceStatus = exports.OnboardingStatus = exports.AccountStatus = exports.UserRole = void 0;
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
    ActivityType["PENDING_ARRIVAL"] = "pending_arrival";
    ActivityType["CHECK_IN"] = "check_in";
    ActivityType["CHECK_OUT"] = "check_out";
    ActivityType["DUE_OUT"] = "due-out";
    ActivityType["BOOKINGS"] = "booking";
    ActivityType["REQUEST_CANCELLATION"] = "request_cancellation";
    ActivityType["CANCELLED"] = "cancelled";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
// Enum for reservation type
var ReservationType;
(function (ReservationType) {
    ReservationType["WALK_IN"] = "walk_in";
    ReservationType["ONLINE_RESERVATION"] = "online_reservation";
})(ReservationType || (exports.ReservationType = ReservationType = {}));
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "pending";
    ReservationStatus["CONFIRMED"] = "confirmed";
    ReservationStatus["CANCELLED"] = "cancelled";
    ReservationStatus["TRANSACTION_COMPLETED"] = "transaction_completed";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
// Enum for the billing status
var BillingStatus;
(function (BillingStatus) {
    BillingStatus["COMPLETE_PAYMENT"] = "complete_payment";
    BillingStatus["PART_PAYMENT"] = "part_payment";
    BillingStatus["REQUEST_REFUND"] = "request_refund";
    BillingStatus["REFUNDED"] = "refunded";
})(BillingStatus || (exports.BillingStatus = BillingStatus = {}));
// Enum for the payment method
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "cash";
    PaymentMethod["BANK_TRANSFER"] = "bank_transfer";
    PaymentMethod["POS_TERMINAL"] = "pos_terminal";
    PaymentMethod["OTHERS"] = "others";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
