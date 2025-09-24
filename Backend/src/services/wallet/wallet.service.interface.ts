import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { EarningResult } from "../../utilities/earningsType";

export interface IWalletService {
    findByUser(userId: string): Promise<IWalletDTO | null>;
    getEarnings(userId: string | null, filter: string): Promise<EarningResult[]>;
}