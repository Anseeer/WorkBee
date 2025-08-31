import { IWallet } from "../../model/wallet/wallet.interface.model";
import { IWalletDTO, IWalletEntity } from "./map.wallet.DTO.interface";

export const mapWalletToDTO = (wallet: IWallet): IWalletDTO => {
    return {
        userId: wallet.userId,
        balance: wallet.balance,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt
    }
}

export const mapWalletToEntity = (wallet: IWallet): IWalletEntity => {
    return {
        userId: wallet.userId,
        balance: wallet.balance,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt
    }
}