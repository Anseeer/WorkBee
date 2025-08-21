import { IWallet } from "../../model/wallet/wallet.interface.model";

export interface IWalletService {
    findByUser(userId:string):Promise<IWallet|null>;
}