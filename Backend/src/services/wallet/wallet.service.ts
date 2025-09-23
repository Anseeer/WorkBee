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
        const findWallet = await this._walletRepository.findByUser(userId);
        const wallet = mapWalletToDTO(findWallet as IWallet);
        return wallet;
    }


    async getEarnings(userId: string | null, filter: string): Promise<EarningResult[]> {
        return await this._walletRepository.getEarnings(userId, filter);
    }

}