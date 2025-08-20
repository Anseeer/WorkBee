import { injectable } from "inversify";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import BaseRepository from "../base/base.repo";
import { IWalletRepository } from "./wallet.repo.interface";
import { Wallet } from "../../model/wallet/wallet.model";
import { isValidObjectId } from "mongoose";

@injectable()
export class WalletRepository extends BaseRepository<IWallet> implements IWalletRepository {
    constructor() {
        super(Wallet);
    }

    async create(item: Partial<IWallet>): Promise<IWallet> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async findByUser(userId: string): Promise<IWallet | null> {
        console.log("WorkerID :", userId);
        if (!isValidObjectId(userId)) {
            throw new Error('Invalid Wallet ID provided.');
        }
        return await this.model.findOne({ userId });
    }
}
