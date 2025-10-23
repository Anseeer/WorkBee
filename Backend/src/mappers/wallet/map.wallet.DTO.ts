import { Types } from "mongoose";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { IWalletDTO, IWalletEntity } from "./map.wallet.DTO.interface";

export const mapWalletToDTO = (wallet: IWallet): IWalletDTO => {
    return {
        _id: wallet.id,
        userId: wallet.userId?.toString() as string,
        balance: wallet.balance,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt
    }
}

export const mapWalletToEntity = (wallet: Partial<IWallet>): IWalletEntity => {
    return {
        userId: new Types.ObjectId(wallet.userId),
        balance: Number(wallet.balance),
        transactions: wallet.transactions ?? [],
        createdAt: wallet.createdAt
    }
}