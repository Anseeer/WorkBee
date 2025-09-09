import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";

export interface IWalletService {
    findByUser(userId: string): Promise<IWalletDTO | null>;
}