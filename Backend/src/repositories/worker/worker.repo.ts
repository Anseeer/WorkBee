import { injectable } from "inversify";
import { IWorker } from "../../model/worker/worker.interface";
import Worker from "../../model/worker/worker.model";
import BaseRepository from "../base/base.repo";
import { IWorkerRepository } from "./worker.repo.interface";
import haversine from 'haversine-distance';
import mongoose, { Types } from "mongoose";
import { SUBSCRIPTION_MESSAGE, WORKER_MESSAGE } from "../../constants/messages";
import { FilterQuery } from "mongoose";
import { Role } from "../../constants/role";
import { ISubscription } from "../../model/subscription/subscription.interface";
import logger from "../../utilities/logger";
import { ISearchTerm } from "../../utilities/Types";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
    constructor() {
        super(Worker);
    }

    async find(): Promise<IWorker[] | []> {
        try {
            return this.model.find();
        } catch (error) {
            logger.error('Error in find:', error);
            throw new Error('Error in find');
        }
    }

    async findByIdAndUpdate(workerId: string, updatedFields: Partial<IWorker>): Promise<IWorker | null> {
        try {
            return await this.model.findByIdAndUpdate(
                workerId,
                { $set: updatedFields },
                { new: true }
            );
        } catch (error) {
            logger.error('Error in findByIdAndUpdate:', error);
            throw new Error('Error in findByIdAndUpdate');
        }
    }

    async getAllWorkers(): Promise<IWorker[]> {
        try {
            return await this.model.find({ role: Role.WORKER, isVerified: true }).sort({ createdAt: -1 });
        } catch (error) {
            logger.error('Error in getAllWorkers:', error);
            throw new Error('Error in getAllWorkers');
        }
    }

    async getAllNonVerifiedWorkers(): Promise<IWorker[]> {
        try {
            return await this.model.find({ role: Role.WORKER, isVerified: false, isAccountBuilt: true }).sort({ createdAt: -1 });
        } catch (error) {
            logger.error('Error in getAllNonVerifiedWorkers:', error);
            throw new Error('Error in getAllNonVerifiedWorkers');
        }
    }

    async setIsActive(workerId: string): Promise<boolean> {
        try {
            const worker = await this.model.findById(workerId);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            const newStatus = !worker.isActive;
            await this.model.updateOne({ _id: workerId }, { $set: { isActive: newStatus } });

            return true;
        } catch (error) {
            logger.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }

    async approveWorker(workerId: string): Promise<boolean> {
        try {
            const worker = await this.model.findById(workerId);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            await this.model.updateOne(
                { _id: workerId },
                { $set: { isVerified: true, status: "Approved" } }
            );

            return true;
        } catch (error) {
            logger.error('Error in approveWorker:', error);
            throw new Error('Error in approveWorker');
        }
    }

    async rejectedWorker(workerId: string, reason: string): Promise<boolean> {
        try {
            const worker = await this.model.findById(workerId);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            console.log("RESon ::::::::", reason)

            await this.model.updateOne(
                { _id: workerId },
                { $set: { isVerified: false, status: "Rejected", rejectionReason: reason } }
            );

            return true;
        } catch (error) {
            logger.error('Error in rejectedWorker:', error);
            throw new Error('Error in rejectdWorker');
        }
    }

    async update(workerData: Partial<IWorker>): Promise<boolean> {
        try {
            const worker = await this.model.findById(workerData.id);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            const updatedFields = {
                name: workerData.name,
                phone: workerData.phone,
                age: workerData.age,
                bio: workerData.bio,
                profileImage: workerData.profileImage,
                radius: workerData.radius,
                location: workerData.location,
                govId: workerData.govId,
                services: workerData.services,
                categories: workerData.categories,
                updatedAt: new Date(),
            };

            const result = await this.model.updateOne(
                { _id: workerData.id },
                { $set: updatedFields }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            logger.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }

    async search(searchTerms: ISearchTerm): Promise<IWorker[]> {
        try {
            const query: FilterQuery<IWorker> = {
                isAccountBuilt: true,
                subscription: { $ne: null },
                isActive: true,
                isVerified: true,
            };

            if (searchTerms.categoryId) {
                query.categories = {
                    $in: [new Types.ObjectId(searchTerms.categoryId)]
                };
            }

            if (searchTerms.serviceId) {
                query["services.serviceId"] = searchTerms.serviceId;
            }

            if (searchTerms.minRating && searchTerms.minRating > 0) {
                query["ratings.average"] = { $gte: searchTerms.minRating };
            }

            if (searchTerms.minCompletedWorks && searchTerms.minCompletedWorks > 0) {
                query.completedWorks = { $gte: searchTerms.minCompletedWorks };
            }

            let workers = await this.model.find(query);

            if (!searchTerms.location) {
                return workers;
            }

            const { lat, lng } = searchTerms.location;

            let filteredWorkers = workers.filter(worker => {
                if (!worker.location || !worker.radius) return false;

                const workerCoords = {
                    latitude: worker.location.lat,
                    longitude: worker.location.lng
                };

                const searchCoords = {
                    latitude: lat,
                    longitude: lng
                };

                const distanceKm = haversine(workerCoords, searchCoords) / 1000;

                return distanceKm <= worker.radius;
            });

            if (searchTerms.maxPrice && searchTerms.maxPrice > 0 && searchTerms.serviceId) {
                filteredWorkers = filteredWorkers.filter(worker => {
                    const service = worker.services.find(
                        s => s.serviceId.toString() === searchTerms.serviceId.toString()
                    );

                    if (!service) return false;
                    return service.price <= searchTerms.maxPrice;
                });
            }

            if (searchTerms.sortBy && searchTerms.serviceId) {
                filteredWorkers = filteredWorkers.sort((a, b) => {
                    const serviceA = a.services.find(
                        s => s.serviceId.toString() === searchTerms.serviceId.toString()
                    );
                    const serviceB = b.services.find(
                        s => s.serviceId.toString() === searchTerms.serviceId.toString()
                    );

                    const priceA = serviceA?.price ?? 0;
                    const priceB = serviceB?.price ?? 0;

                    if (searchTerms.sortBy === "priceLowToHigh") {
                        return priceA - priceB;
                    }

                    if (searchTerms.sortBy === "priceHighToLow") {
                        return priceB - priceA;
                    }

                    return 0;
                });
            }

            return filteredWorkers;

        } catch (error) {
            logger.error('Error in search:', error);
            throw new Error('Error in search');
        }
    }

    async findWorkerById(workerId: string): Promise<IWorker | null> {
        try {
            const worker = await this.model.findById(workerId);

            return worker;
        } catch (error) {
            logger.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async findWorkersByIds(workerIds: string[]): Promise<IWorker[]> {
        try {
            return await this.model.find({ _id: { $in: workerIds } });
        } catch (error) {
            logger.error('Error in findWorkersByIds:', error);
            throw new Error('Error in findWorkersByIds');
        }
    }

    async rateWorker(workerId: string, rating: number): Promise<{ average: number, ratingsCount: number }> {
        try {
            const worker = await this.model.findById(workerId);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            const totalRatings = worker.ratings.ratingsCount || 0;
            const currentAverage = worker.ratings.average || 0;

            const newRatingsCount = totalRatings + 1;
            const newAverage = (currentAverage * totalRatings + rating) / newRatingsCount;

            await this.model.updateOne(
                { _id: workerId },
                {
                    $set: {
                        "ratings.average": newAverage,
                        "ratings.ratingsCount": newRatingsCount
                    }
                }
            );

            return {
                average: newAverage,
                ratingsCount: newRatingsCount
            };

        } catch (error) {
            logger.error('Error in rateWorker:', error);
            throw new Error('Error in rateWorker');
        }
    }

    async updateCompletedWorks(workerId: string): Promise<void> {
        try {
            await this.model.updateOne(
                { _id: new mongoose.Types.ObjectId(workerId) },
                { $inc: { completedWorks: 1 } }
            );
        } catch (error) {
            logger.error('Error in updateCompletedWorks:', error);
            throw new Error('Error in updateCompletedWorks');
        }
    }

    async setSubscriptionPlan(workerId: string, planData: Partial<ISubscription>): Promise<IWorker> {
        try {
            if (!workerId || !planData) {
                throw new Error(SUBSCRIPTION_MESSAGE.MISSING_DATA);
            }
            const startDate = new Date();
            const durationDays = planData.durationInDays || 0;
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + durationDays);

            const subscription = {
                plan: planData._id,
                startDate,
                endDate,
                commission: planData.comission
            };

            const updatedWorker = await this.model.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(workerId) },
                { $set: { subscription } },
                { new: true }
            );

            if (!updatedWorker) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            return updatedWorker;
        } catch (error) {
            logger.error('Error in setSubscriptionPlan:', error);
            throw new Error('Error in setSubscriptionPlan');
        }
    }

    async setPlanExpired(workerId: string): Promise<boolean> {
        try {
            if (!workerId) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const result = await this.model.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(workerId) },
                { $set: { subscription: null } },
                { new: true }
            );

            return !!result;
        } catch (error) {
            logger.error('Error in setPlanExpired:', error);
            throw new Error('Error in setPlanExpired');
        }
    }

    async reApprovalRequest(workerId: string): Promise<boolean> {
        try {
            if (!workerId) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const result = await this.model.findOneAndUpdate(
                { _id: new mongoose.Types.ObjectId(workerId) },
                { $set: { status: "Re-approval" } },
                { new: true }
            );

            return !!result;
        } catch (error) {
            logger.error('Error in reApprovalRequest:', error);
            throw new Error('Error in reApprovalRequest');
        }
    }

}
