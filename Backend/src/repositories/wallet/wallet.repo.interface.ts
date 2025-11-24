import { IWallet } from "../../model/wallet/wallet.interface.model";
import { EarningResult } from "../../utilities/Types";

export interface IWalletRepository {
    create(walletDetails: Partial<IWallet>): Promise<IWallet>;
    findByUser(userId: string): Promise<IWallet | null>;
    findPlatformWallet(): Promise<IWallet | null>;
    getEarnings(userId: string | null, filter: string): Promise<EarningResult[]>
    platformWallet(): Promise<IWallet | null>;
    update(updateData: Partial<IWallet>, userId: string): Promise<void>;
    updatePlatformWallet(updateData: Partial<IWallet>, walletType: string): Promise<void>;
}
