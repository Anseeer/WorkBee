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
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error in create');
        }
    }

    async findByUser(userId: string): Promise<IWallet | null> {
        try {
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
        } catch (error) {
            console.error('Error in findByUser:', error);
            throw new Error('Error in findByUser');
        }
    }


}
