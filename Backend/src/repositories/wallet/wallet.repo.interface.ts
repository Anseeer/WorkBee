import { IWallet } from "../../model/wallet/wallet.interface.model";

export interface IWalletRepository {
    create(walletDetails: Partial<IWallet>): Promise<IWallet>;
    findByUser(userId: string): Promise<IWallet | null>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEarnings(userId: string, filter: string): Promise<any[]>;
}
