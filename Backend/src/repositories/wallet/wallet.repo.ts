/* eslint-disable @typescript-eslint/no-explicit-any */
import { injectable } from "inversify";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import BaseRepository from "../base/base.repo";
import { IWalletRepository } from "./wallet.repo.interface";
import { Wallet } from "../../model/wallet/wallet.model";
import mongoose, { isValidObjectId } from "mongoose";
import { EarningResult } from "../../utilities/earningsType";

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

    async getEarnings(userId: string | null, filter: string): Promise<EarningResult[]> {
        try {
            let groupStage: any = {};
            let earnings: EarningResult[];

            if (filter === "monthly") {
                groupStage = {
                    _id: { month: { $month: "$transactions.createdAt" } },
                    totalEarnings: { $sum: "$transactions.amount" }
                };
            } else if (filter === "yearly") {
                groupStage = {
                    _id: { year: { $year: "$transactions.createdAt" } },
                    totalEarnings: { $sum: "$transactions.amount" }
                };
            } else {
                throw new Error("Invalid filter. Use 'monthly' or 'yearly'.");
            }

            if (userId) {
                earnings = await this.model.aggregate([
                    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
                    { $unwind: "$transactions" },
                    { $match: { "transactions.type": "CREDIT" } },
                    { $group: groupStage },
                    { $sort: { "_id": 1 } }
                ]);
            } else {
                earnings = await this.model.aggregate([
                    { $match: { walletType: "PLATFORM" } },
                    { $unwind: "$transactions" },
                    { $match: { "transactions.type": "CREDIT" } },
                    { $group: groupStage },
                    { $sort: { "_id": 1 } }
                ]);
            }

            return earnings;
        } catch (error) {
            console.error("Error in getEarnings:", error);
            throw new Error("Error in getEarnings");
        }
    }

    async platformWallet(): Promise<IWallet | null> {
        try {

            const wallet = await this.model.findOne({ walletType: "PLATFORM" }).lean();

            if (wallet) {
                wallet.transactions.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            }

            return wallet;
        } catch (error) {
            console.error('Error in platformWallet:', error);
            throw new Error('Error in platformWallet');
        }
    }

    async update(updateData: Partial<IWallet>, userId: string): Promise<void> {
        try {
            if (!updateData || !userId) {
                throw new Error("updateData or userId not provided");
            }

            await this.model.updateOne(
                { userId },
                {
                    $inc: { balance: updateData.balance || 0 },
                    $push: { transactions: { $each: updateData.transactions || [] } }
                }
            );
        } catch (error) {
            console.error('Error in updateWallet:', error);
            throw new Error('Error in updateWallet');
        }
    }

    async updatePlatformWallet(updateData: Partial<IWallet>, walletType: string): Promise<void> {
        try {
            if (!updateData || !walletType) {
                throw new Error("updateData or userId not provided");
            }

            await this.model.updateOne(
                { walletType },
                {
                    $inc: { balance: updateData.balance || 0 },
                    $push: { transactions: { $each: updateData.transactions || [] } }
                }
            );
        } catch (error) {
            console.error('Error in updateWallet:', error);
            throw new Error('Error in updateWallet');
        }
    }

}
