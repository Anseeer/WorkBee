import { inject, injectable } from "inversify";
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";
import { IWalletService } from "./wallet.service.interface";
import TYPES from "../../inversify/inversify.types";
import { IWallet } from "../../model/wallet/wallet.interface.model";

@injectable()
export class WalletService  implements IWalletService{
    private _walletRepository :IWalletRepository;
    constructor(@inject(TYPES.walletRepository)walletRepo:IWalletRepository){
        this._walletRepository = walletRepo;
    }
    
    async findByUser(userId: string): Promise<IWallet|null> {
        return await this._walletRepository.findByUser(userId);
    }

}