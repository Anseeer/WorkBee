import { IWalletEntity } from "../../mappers/wallet/map.wallet.DTO.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";

export interface IWalletRepository {
    create(walletDetails: Partial<IWalletEntity>): Promise<IWallet>;
    findByUser(userId: string): Promise<IWallet | null>;
}
