import { injectable } from "inversify";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import BaseRepository from "../base/base.repo";
import { IWalletRepository } from "./wallet.repo.interface";
import { Wallet } from "../../model/wallet/wallet.model";
import { isValidObjectId } from "mongoose";
import { IWalletEntity } from "../../mappers/wallet/map.wallet.DTO.interface";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
        super(Wallet);
    }

    async create(item: Partial<IWalletEntity>): Promise<IWallet> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async findByUser(userId: string): Promise<IWallet | null> {
        console.log("WorkerID :", userId);
        if (!isValidObjectId(userId)) {
            throw new Error('Invalid Wallet ID provided.');
        }
        const wallet = await this.model.findOne({ userId }).lean();
        if (wallet) {
            wallet.transactions.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
        return wallet;
    }
}
