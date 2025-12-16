import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { ITempUserService } from "./temp.user.service.interface";
import { ITempUser } from "../../model/temp_user/temp.user.interface";
import { ITempUserRepository } from "../../repositories/temp_user/temp.user.interface.repo";
import { USERS_MESSAGE } from "../../constants/messages";
import { IUserRepository } from "../../repositories/user/user.repo.interface";
import { mapToTempUserEntity } from "../../mappers/temp_user/temp.user.map.DTO";
import logger from "../../utilities/logger";
import { generateOTP } from "../../utilities/generateOtp";
import { emailService } from "../../utilities/emailService";
import { saveOtp } from "../../utilities/otpStore";

@injectable()
export class TempUserService implements ITempUserService {
    private _tempUserRepository: ITempUserRepository;
    private _userRepository: IUserRepository;
    constructor(
        @inject(TYPES.tempUserRepository) tempUserRepo: ITempUserRepository,
        @inject(TYPES.userRepository) userRepo: IUserRepository,
    ) {
        this._tempUserRepository = tempUserRepo;
        this._userRepository = userRepo;
    }

    async register(userData: Partial<ITempUser>): Promise<string> {
        try {

            if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
                throw new Error(USERS_MESSAGE.ALL_FIELDS_REQUIRED_FOR_REGISTRATION);
            }

            const userExist = await this._userRepository.findByEmail(userData.email);
            if (userExist) {
                throw new Error(USERS_MESSAGE.USER_ALREADY_EXISTS_WITH_EMAIL);
            }

            const existInTemp = await this._tempUserRepository.findTempUserByEmail(userData?.email)

            if (existInTemp) {
                await this._tempUserRepository.delete(existInTemp.id)
            }

            const hashedPass = await bcrypt.hash(userData.password, 10);
            const otp = await generateOTP();
            saveOtp(userData.email, otp);
            await emailService(userData.email, otp, "VERIFY_EMAIL");
            userData.password = hashedPass;
            userData.otp = otp;
            const userEntity = await mapToTempUserEntity(userData);
            const newUser = await this._tempUserRepository.create(userEntity);
            return newUser.id;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error("Error in the temp_user creating", errMsg);
            throw new Error(errMsg);
        }
    }

    async resendOtp(userId: string): Promise<string> {
        try {
            if (!userId) {
                throw new Error(USERS_MESSAGE.USER_ID_NOT_GET);
            }

            const userExist = await this._tempUserRepository.findUserById(userId);
            if (!userExist) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER_REGISTER_FIRST);
            }

            const otp = await generateOTP();

            saveOtp(userExist.email, otp);
            await emailService(userExist.email, otp, "VERIFY_EMAIL");

            await this._tempUserRepository.updateById(userId, {
                otp,
                updatedAt: new Date()
            });

            return userId;

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error("Error in resendOtp", errMsg);
            throw new Error(errMsg);
        }
    }

}