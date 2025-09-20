import { injectable } from "inversify";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import BaseRepository from "../base/base.repo";
import { IWalletRepository } from "./wallet.repo.interface";
import { Wallet } from "../../model/wallet/wallet.model";
import mongoose, { isValidObjectId } from "mongoose";

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

    async getEarnings(userId: string, filter: string) {
        try {
            let startDate: Date;
            let endDate: Date = new Date();

            const now = new Date();

            if (filter === "monthly") {
                startDate = new Date(now.getFullYear(), 0, 1);
            } else if (filter === "yearly") {
                startDate = new Date(now.getFullYear() - 5, 0, 1);
            } else {
                throw new Error("Invalid filter");
            }

            const earnings = await Wallet.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                { $unwind: "$transactions" },
                {
                    $match: {
                        "transactions.type": "CREDIT",
                        "transactions.createdAt": { $gte: startDate, $lte: endDate }
                    }
                },
                {
                    $group: {
                        _id:
                            filter === "monthly"
                                ? { month: { $month: "$transactions.createdAt" } }
                                : { year: { $year: "$transactions.createdAt" } },
                        totalEarnings: { $sum: "$transactions.amount" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            return earnings;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }



}
