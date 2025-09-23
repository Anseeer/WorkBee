import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { IWork } from "../../model/work/work.interface";
import { IWorkRepository } from "./work.repo.interface";
import Work from "../../model/work/work.model";
import { WORK_MESSAGE } from "../../constants/messages";
import { TopThreeResult } from "../../utilities/topThreeTypes";

@injectable()
export class WorkRepository extends BaseRepository<IWork> implements IWorkRepository {
    constructor() {
        super(Work);
    }
    async create(item: Partial<IWork>): Promise<IWork> {
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error in create');
        }
    }

    async findByUser(userId: string): Promise<IWork[]> {
        try {
            return await this.model.find({ userId }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in findByUser:', error);
            throw new Error('Error in findByUser');
        }
    }

    async findByWorker(workerId: string): Promise<IWork[]> {
        try {
            return await this.model.find({ workerId }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in findByWorker:', error);
            throw new Error('Error in findByWorker');
        }
    }

    async cancel(workId: string): Promise<boolean> {
        try {
            const res = await this.model.updateOne(
                { _id: workId },
                { $set: { status: "Canceled" } }
            );
            return res.modifiedCount > 0;
        } catch (error) {
            console.error('Error in cancel:', error);
            throw new Error('Error in cancel');
        }
    }

    async accept(workId: string): Promise<boolean> {
        try {
            const res = await this.model.updateOne(
                { _id: workId },
                { $set: { status: "Accepted" } }
            );
            return res.modifiedCount > 0;
        } catch (error) {
            console.error('Error in accept:', error);
            throw new Error('Error in accept');
        }
    }

    async findById(workId: string): Promise<IWork> {
        try {
            const workDetails = await this.model.findById(workId);
            if (!workDetails) {
                throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }
            return workDetails;
        } catch (error) {
            console.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async setIsWorkCompleted(workId: string): Promise<boolean> {
        try {
            const work = await this.model.findById(workId);
            if (!work) {
                throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }

            if (work.isCompleted) {
                throw new Error(WORK_MESSAGE.WORK_ALREADY_MARK_COMPLETED);
            }

            work.isCompleted = true;
            work.status = "Completed";
            work.paymentStatus = "Pending";

            await work.save();
            return true;
        } catch (error) {
            console.error('Error in setIsWorkCompleted:', error);
            throw new Error('Error in setIsWorkCompleted');
        }
    }

    async getAllWorks(): Promise<IWork[]> {
        try {
            return await this.model.find().sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in getAllWorks:', error);
            throw new Error('Error in getAllWorks');
        }
    }

    async getAssignedWorks(workerId: string): Promise<IWork[]> {
        try {
            return await this.model.find({ workerId, status: "Accepted" }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in getAssignedWorks:', error);
            throw new Error('Error in getAssignedWorks');
        }
    }

    async getRequestedWorks(workerId: string): Promise<IWork[]> {
        try {
            return await this.model.find({ workerId, status: "Pending" }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in getRequestedWorks:', error);
            throw new Error('Error in getRequestedWorks');
        }
    }

    async getTopThree(): Promise<TopThreeResult[]> {
        return await this.model.aggregate([
            {
                $facet: {
                    TopServices: [
                        { $group: { _id: "$serviceId", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 3 },
                        {
                            $lookup: {
                                from: "services",
                                localField: "_id",
                                foreignField: "_id",
                                as: "service"
                            }
                        },
                        { $unwind: "$service" },
                        {
                            $project: {
                                _id: 1,
                                count: 1,
                                name: "$service.name"
                            }
                        }],
                    TopCategory: [
                        { $group: { _id: "$categoryId", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 3 },
                        {
                            $lookup: {
                                from: "categories",
                                localField: "_id",
                                foreignField: "_id",
                                as: "category"
                            }
                        },
                        { $unwind: "$category" },
                        {
                            $project: {
                                _id: 1,
                                count: 1,
                                name: "$category.name"
                            }
                        }],
                    TopWorker: [
                        { $group: { _id: "$workerId", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 3 },
                        {
                            $lookup: {
                                from: "workers",
                                localField: "_id",
                                foreignField: "_id",
                                as: "workers"
                            }
                        },
                        { $unwind: "$workers" },
                        {
                            $project: {
                                _id: 1,
                                count: 1,
                                name: "$workers.name"
                            }
                        }],
                    TopUsers: [
                        { $group: { _id: "$userId", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 3 },
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "users"
                            }
                        },
                        { $unwind: "$users" },
                        {
                            $project: {
                                _id: 1,
                                count: 1,
                                name: "$users.name"
                            }
                        }]
                },
            }
        ])
    }

}