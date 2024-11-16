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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = exports.userRepository = void 0;
const typeorm_1 = require("typeorm");
const data_source_1 = require("../data-source");
const UserEntity_1 = require("../entities/UserEntity");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const emailActions_1 = require("../lib/emailActions");
const constants_1 = require("../constants");
const uuid_1 = require("uuid"); // For generating verification tokens
exports.userRepository = data_source_1.AppDataSource.getRepository(UserEntity_1.User);
class UserService {
    static register(arg0) {
        throw new Error('Method not implemented.');
    }
    static findTenantId(tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exports.userRepository.findOneBy({ tenantId });
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield exports.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error('Invalid email or password');
            }
            const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid email or password');
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return token;
        });
    }
    findByVerificationToken(verifyToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.findOne({ where: { verificationToken: verifyToken } });
        });
    }
    verifyUser(verifyToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByVerificationToken(verifyToken);
            if (!user) {
                throw new Error('Invalid or expired verification token');
            }
            user.isVerified = true;
            user.verificationToken = null; // Clear the token
            yield exports.userRepository.save(user);
            return user;
        });
    }
    updateProfile(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield exports.userRepository.findOneBy({ id });
            if (!user) {
                throw new Error('User not found');
            }
            Object.assign(user, updatedData); // Update user fields
            yield exports.userRepository.save(user);
        });
    }
    updateUserRole(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(UserEntity_1.User);
            try {
                // Find the user by ID
                const user = yield userRepository.findOneBy({ id });
                if (!user) {
                    return null;
                }
                // Update the user role
                user.role = role;
                yield userRepository.save(user);
                return user;
            }
            catch (error) {
                console.error('Error updating user role in service:', error);
                throw error;
            }
        });
    }
    findOneAndUpdate(filter, update, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by email and two-factor token, and ensure the two-factor code has not expired
                const user = yield exports.userRepository.findOne({
                    where: {
                        email: filter.email,
                        twoFactorToken: filter.twoFactorToken,
                        twoFactorExpires: (0, typeorm_1.MoreThan)(new Date()), // Use MoreThan for date comparison
                    },
                });
                if (!user) {
                    console.log('User not found or two-factor token is invalid');
                    return null; // User not found or two-factor token is invalid
                }
                // If accountStatus is false, set it to true
                if (!user.accountStatus) {
                    console.log('Activating user account');
                    user.accountStatus = constants_1.AccountStatus.Active;
                }
                // Update the user's two-factor token and expiration
                if (options.returnNewDocument) {
                    console.log('Updating user with new values:', {
                        twoFactorToken: update.twoFactorToken,
                        twoFactorExpires: update.twoFactorExpires,
                    });
                    user.twoFactorToken = update.twoFactorToken;
                    user.twoFactorExpires = update.twoFactorExpires;
                    yield exports.userRepository.save(user); // Save the updated user
                    console.log('User updated successfully');
                }
                return user;
            }
            catch (error) {
                console.error('Error in findOneAndUpdate:', error);
                throw new Error('Error updating user');
            }
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Find the user by ID
                const user = yield exports.userRepository.findOne({ where: { id: userId } });
                return user || null; // Return null if user is not found
            }
            catch (error) {
                console.error('Error finding user by ID:', error);
                throw new Error('Error retrieving user');
            }
        });
    }
    // Get all users
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.find();
        });
    }
    // async getAllByStatus(status?: accountStatus): Promise<User[]> {
    //   return userRepository.createQueryBuilder('user')
    //       .where('user.accountStatus = :status', { status })
    //       .getMany();
    // }
    getAllByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.createQueryBuilder('user')
                .where('user.accountStatus = :status', { status })
                .getMany();
        });
    }
    findByStatus(accountStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exports.userRepository.find({ where: { accountStatus } }); // Adjust based on your ORM/DB library
        });
    }
    findByStatusAndRole(status, role) {
        return __awaiter(this, void 0, void 0, function* () {
            // const userRepository = getRepository(User);
            // Find users by onboarding status and role
            const users = yield exports.userRepository.find({
                where: {
                    accountStatus: status,
                    role: role,
                },
            });
            return users;
        });
    }
    // Get user by ID
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.findOneBy({ id });
        });
    }
    // Create new user
    create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = exports.userRepository.create(userData);
            return exports.userRepository.save(user);
        });
    }
    // Update user
    update(id, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield exports.userRepository.findOneBy({ id });
            if (user) {
                Object.assign(user, userData);
                return exports.userRepository.save(user);
            }
            return null;
        });
    }
    // Delete user
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield exports.userRepository.delete(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const normalizedEmail = email.trim().toLowerCase();
                console.log(`Searching for user with email: ${normalizedEmail}`); // Debugging
                return yield exports.userRepository.findOne({ where: { email: normalizedEmail } });
            }
            catch (error) {
                console.error('Error finding user by email:', error);
                throw new Error('Could not find user by email');
            }
        });
    }
    // async findByEmailAndTenant(email: string, tenantId: string): Promise<User | null> {
    //   try {
    //     const normalizedEmail = email.trim().toLowerCase();
    //     console.log(`Searching for user with email: ${normalizedEmail} in tenant: ${tenantId}`); // Debugging
    //     // Find user by email and tenantId
    //     return await userRepository.findOne({ 
    //       where: { 
    //         email: normalizedEmail, 
    //         tenantId: tenantId 
    //       } 
    //     });
    //   } catch (error) {
    //     console.error('Error finding user by email and tenant:', error);
    //     throw new Error('Could not find user by email and tenant');
    //   }
    // }
    findByEmailAndTenant(email, tenantId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const normalizedEmail = email.trim().toLowerCase();
                console.log(`Searching for user with email: ${normalizedEmail} in tenant: ${tenantId}`); // Debugging
                return yield exports.userRepository.findOne({
                    where: {
                        email: normalizedEmail,
                        hotel: { tenantId },
                    },
                    relations: ['hotel'],
                });
            }
            catch (error) {
                console.error('Error finding user by email and tenant:', error);
                throw new Error('Could not find user by email and tenant');
            }
        });
    }
    // static async findEmployeeId(employeeId: string): Promise<User | null> {
    //   try {
    //     return await userRepository.findOne({ where: { employeeId } });
    //   } catch (error) {
    //     console.error('Error finding user by employeeId:', error);
    //     throw new Error('Could not find user by employeeId');
    //   }
    // }
    static findEmployeeId(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield exports.userRepository.findOneBy({ employeeId });
        });
    }
    findByResetToken(resetPasswordToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield exports.userRepository.findOne({
                    where: {
                        resetPasswordToken,
                        resetPasswordExpires: (0, typeorm_1.MoreThan)(new Date()),
                    },
                });
            }
            catch (error) {
                console.error('Error finding user by reset token:', error);
                throw new Error('Could not find user by reset token');
            }
        });
    }
    static generateTenantId(role) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefix = role === 'admin' ? 'adm' : 'emp';
            const uniqueId = (0, uuid_1.v4)().slice(0, 8).toUpperCase(); // Unique part of the application number
            return `${prefix}-${uniqueId}`;
        });
    }
    generateAndSendTwoFactorToken(id, loginType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield exports.userRepository.findOneBy({ id });
                if (!user) {
                    throw new Error('User not found');
                }
                // Generate a 6-digit numeric token
                const twoFactorToken = Math.floor(100000 + Math.random() * 900000).toString();
                // const twoFactorToken = crypto.randomBytes(3).toString("hex");
                user.twoFactorToken = twoFactorToken;
                user.twoFactorExpires = new Date(Date.now() + 300000); // 5 minutes from now
                user.twoFactorEnabled = true;
                yield this.updateData(user);
                if (loginType == "password-less") {
                    yield (0, emailActions_1.sendLoginLink)({ email: user.email, firstName: user.firstName }, twoFactorToken);
                }
                else {
                    yield (0, emailActions_1.sendTwoFactorCodeEmail)({ email: user.email, firstName: user.firstName }, twoFactorToken);
                }
            }
            catch (error) {
                console.error('Error generating or sending two-factor token:', error);
                throw new Error('Could not generate or send two-factor token');
            }
        });
    }
    verifyTwoFactorCode(email, twoFactorCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedCode = crypto_1.default.createHash('sha256').update(twoFactorCode).digest('hex');
                const user = yield exports.userRepository.findOne({
                    where: {
                        email,
                        twoFactorToken: hashedCode,
                        twoFactorExpires: (0, typeorm_1.MoreThan)(new Date())
                    }
                });
                if (!user) {
                    // Check if the token has expired or if the user doesn't exist
                    const expiredUser = yield exports.userRepository.findOne({
                        where: {
                            email,
                            twoFactorExpires: (0, typeorm_1.LessThan)(new Date())
                        }
                    });
                    if (expiredUser) {
                        return 'The two-factor code has expired. Please request a new one.';
                    }
                    return 'Invalid email or two-factor code.';
                }
                // Clear the two-factor token and expiry date after successful verification
                user.twoFactorToken = null;
                user.twoFactorExpires = null;
                user.twoFactorEnabled = false;
                yield this.updateData(user);
                return 'Two-factor verification successful.';
            }
            catch (error) {
                console.error('Error verifying two-factor code:', error);
                throw new Error('Error verifying two-factor code');
            }
        });
    }
    updateData(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield exports.userRepository.save(user);
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Could not update user');
            }
        });
    }
    findUsersWithIncompleteOnboarding() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.createQueryBuilder('user')
                .where('user.onboardingStep < :step', { step: 12 })
                .andWhere('user.role = :role', { role: 'applicant' })
                .getMany();
        });
    }
    findUsersWithOnboardingInProgress() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.createQueryBuilder('user')
                .where('user.onboardingStep > :minStep', { minStep: 1 })
                .andWhere('user.onboardingStep < :maxStep', { maxStep: 11 })
                .andWhere('user.role = :role', { role: 'applicant' })
                .getMany();
        });
    }
    findAllAprrovedCandidates() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.userRepository.createQueryBuilder('user')
                .where('user.accountStatus = :accountStatus', { accountStatus: 'Approved' })
                .getMany();
        });
    }
}
exports.UserService = UserService;
