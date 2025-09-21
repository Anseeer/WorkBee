import { IWallet } from "../../model/wallet/wallet.interface.model";
import { EarningResult } from "../../utilities/earningsType";

export interface IWalletRepository {
    create(walletDetails: Partial<IWallet>): Promise<IWallet>;
    findByUser(userId: string): Promise<IWallet | null>;
    getEarnings(userId: string, filter: string): Promise<EarningResult[]>
}
