import { inject, injectable } from "inversify";
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";
import { IWalletService } from "./wallet.service.interface";
import TYPES from "../../inversify/inversify.types";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { mapWalletToDTO } from "../../mappers/wallet/map.wallet.DTO";
import { EarningResult } from "../../utilities/earningsType";

@injectable()
export class WalletService implements IWalletService {
    private _walletRepository: IWalletRepository;
    constructor(@inject(TYPES.walletRepository) walletRepo: IWalletRepository) {
        this._walletRepository = walletRepo;
    }


    async findByUser(userId: string): Promise<IWalletDTO | null> {
        try {
            const findWallet = await this._walletRepository.findByUser(userId);
            if (!findWallet) return null;

            const wallet = mapWalletToDTO(findWallet as IWallet);
            return wallet;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    async getEarnings(userId: string | null, filter: string): Promise<EarningResult[]> {
        try {
            return await this._walletRepository.getEarnings(userId, filter);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    async update(updateData: Partial<IWallet>, userId: string): Promise<void> {
        try {
            if (!updateData || !userId) {
                throw new Error("updateData or userId not get");
            }
            await this._walletRepository.update(updateData, userId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    async updatePlatformWallet(updateData: Partial<IWallet>, walletType: string): Promise<void> {
        try {
            if (!updateData || !walletType) {
                throw new Error("updateData or userId not get");
            }
            await this._walletRepository.updatePlatformWallet(updateData, walletType);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    async create(walletData: Partial<IWallet>): Promise<IWalletDTO | null> {
        try {
            if (!walletData) {
                throw new Error("WalletData not get");
            }
            const wallet = await this._walletRepository.create(walletData);
            return await mapWalletToDTO(wallet);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

}