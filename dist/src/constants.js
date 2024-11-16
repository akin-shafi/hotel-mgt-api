"use strict";
// src/constants.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingStatus = exports.AccountStatus = exports.UserRole = void 0;
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
