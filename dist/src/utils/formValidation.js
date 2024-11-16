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
exports.validatePhone = void 0;
const validatePhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const phoneDigits = phone.replace(/\D/g, ''); // Remove non-numeric characters
    // UK number validation
    if (phone.startsWith('+44') || phone.startsWith('44')) {
        return phoneDigits.length === 12; // Expect exactly 12 digits for +44 or 44 format
    }
    else if (/^\d{10,11}$/.test(phoneDigits)) { // Local UK number (without 44 prefix)
        return true; // 10 or 11 digits are valid for local UK numbers
    }
    // International format validation (not UK)
    return /^\+\d{10,15}$/.test(phone); // + followed by 10 to 15 digits
});
exports.validatePhone = validatePhone;
