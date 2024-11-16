


export const validatePhone = async (phone: string): Promise<boolean> => {
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
}