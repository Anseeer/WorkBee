import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { EarningResult } from "../../utilities/earningsType";

export interface IWalletService {
    findByUser(userId: string): Promise<IWalletDTO | null>;
    getEarnings(userId: string | null, filter: string): Promise<EarningResult[]>;
    update(updateData: Partial<IWallet>, userId: string): Promise<void>;
    updatePlatformWallet(updateData: Partial<IWallet>, walletType: string): Promise<void>;
    create(walletData: Partial<IWallet>): Promise<IWalletDTO | null>;
}