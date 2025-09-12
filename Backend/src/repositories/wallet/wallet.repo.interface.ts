import { IWallet } from "../../model/wallet/wallet.interface.model";

export interface IWalletRepository {
    create(walletDetails: Partial<IWallet>): Promise<IWallet>;
    findByUser(userId: string): Promise<IWallet | null>;
}
