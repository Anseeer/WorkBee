import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWorker } from "../../model/worker/worker.interface";
import Worker from "../../model/worker/worker.model";
import BaseRepository from "../base/base.repo";
import { IWorkerRepository } from "./worker.repo.interface";
import { Availability } from "../../model/availablity/availablity.model";
import { IWork } from "../../model/work/work.interface";
import haversine from 'haversine-distance';
import { Types } from "mongoose";
import { WORKER_MESSAGE } from "../../constants/messages";
import { FilterQuery } from "mongoose";
import { Role } from "../../constants/role";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
    constructor() {
        super(Worker);
    }

    async findByIdAndUpdate(id: string, updatedFields: Partial<IWorker>): Promise<IWorker | null> {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { $set: updatedFields },
                { new: true }
            );
        } catch (error) {
            console.error('Error in findByIdAndUpdate:', error);
            throw new Error('Error in findByIdAndUpdate');
        }
    }

    async findAvailabilityByWorkerId(id: string): Promise<IAvailability | null> {
        try {
            return await Availability.findOne({ workerId: id });
        } catch (error) {
            console.error('Error in findAvailabilityByWorkerId:', error);
            throw new Error('Error in findAvailabilityByWorkerId');
        }
    }

    async setAvailability(availability: IAvailability): Promise<IAvailability> {
        try {
            return await Availability.create(availability);
        } catch (error) {
            console.error('Error in setAvailability:', error);
            throw new Error('Error in setAvailability');
        }
    }

    async updateAvailability(workerId: string, availability: IAvailability): Promise<IAvailability | null> {
        try {
            return await Availability.findOneAndUpdate(
                { workerId },
                { $set: availability },
                { new: true }
            );
        } catch (error) {
            console.error('Error in updateAvailability:', error);
            throw new Error('Error in updateAvailability');
        }
    }

    async getAllWorkers(): Promise<IWorker[]> {
        try {
            return await this.model.find({ role: Role.WORKER, isVerified: true }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in getAllWorkers:', error);
            throw new Error('Error in getAllWorkers');
        }
    }

    async getAllNonVerifiedWorkers(): Promise<IWorker[]> {
        try {
            return await this.model.find({ role: Role.WORKER, isVerified: false, isAccountBuilt: true }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error in getAllNonVerifiedWorkers:', error);
            throw new Error('Error in getAllNonVerifiedWorkers');
        }
    }

    async setIsActive(id: string): Promise<boolean> {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            const newStatus = !worker.isActive;
            await this.model.updateOne({ _id: id }, { $set: { isActive: newStatus } });

            return true;
        } catch (error) {
            console.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }

    async approveWorker(id: string): Promise<boolean> {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            await this.model.updateOne(
                { _id: id },
                { $set: { isVerified: true, status: "Approved" } }
            );

            return true;
        } catch (error) {
            console.error('Error in approveWorker:', error);
            throw new Error('Error in approveWorker');
        }
    }

    async rejectedWorker(id: string): Promise<boolean> {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
            }

            await this.model.updateOne(
                { _id: id },
                { $set: { isVerified: false, status: "Rejected" } }
            );

            return true;
        } catch (error) {
            console.error('Error in rejectedWorker:', error);
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
                workType: workerData.workType,
                preferredSchedule: workerData.preferredSchedule,
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
            console.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }

    async search(searchTerms: Partial<IWork>): Promise<IWorker[]> {
        try {
            const query: FilterQuery<IWorker> = {
                workType: { $in: searchTerms.workType },
                isAccountBuilt: true,
                isActive: true,
                isVerified: true,
            };

            if (searchTerms.categoryId) {
                query.categories = { $in: [new Types.ObjectId(searchTerms.categoryId.toString())] };
            }

            if (searchTerms.serviceId) {
                query.services = { $in: [new Types.ObjectId(searchTerms.serviceId.toString())] };
            }

            const workers = await this.model.find(query);

            if (!searchTerms.location) {
                return workers;
            }

            const { lat, lng } = searchTerms.location;

            const filteredWorkers = workers.filter(worker => {
                if (!worker.location || !worker.radius) {
                    return false;
                }

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

            return filteredWorkers;
        } catch (error) {
            console.error('Error in search:', error);
            throw new Error('Error in search');
        }
    }

    async findById(id: string): Promise<IWorker> {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }

            return worker;
        } catch (error) {
            console.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async findWorkersByIds(workerIds: string[]): Promise<IWorker[]> {
        try {
            return await this.model.find({ _id: { $in: workerIds } });
        } catch (error) {
            console.error('Error in findWorkersByIds:', error);
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
            console.error('Error in rateWorker:', error);
            throw new Error('Error in rateWorker');
        }
    }



}
