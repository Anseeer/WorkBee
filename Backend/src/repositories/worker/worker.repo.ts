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
import { IWallet } from "../../model/wallet/wallet.interface.model";



@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
    constructor() {
        super(Worker);
    }

    async findByIdAndUpdate(id: string, updatedFields: Partial<IWorker>): Promise<IWorker | null> {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );
    }

    async findAvailabilityByWorkerId(id: string): Promise<IAvailability | null> {
        return await Availability.findOne({ workerId: id });
    }

    async setAvailability(availability: IAvailability): Promise<IAvailability> {
        return await Availability.create(availability);
    }

    async updateAvailability(workerId: string, availability: IAvailability): Promise<IAvailability | null> {
        return await Availability.findOneAndUpdate(
            { workerId },
            { $set: availability },
            { new: true }
        );
    }

    async getAllWorkers(): Promise<IWorker[]> {
        let allWorker = await this.model.find({ role: "Worker", isVerified: true }).sort({ createdAt: -1 });
        return allWorker;
    }

    async getAllNonVerifiedWorkers(): Promise<IWorker[]> {
        let allWorker = await this.model.find({ role: "Worker", isVerified: false, isAccountBuilt: true }).sort({ createdAt: -1 });
        return allWorker;
    }

    async setIsActive(id: string): Promise<boolean> {
        let worker = await this.model.findById(id);
        if (!worker) {
            throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
        }
        let newStatus = !worker.isActive;

        await this.model.updateOne({ _id: id }, { $set: { isActive: newStatus } });
        return true;
    }

    async approveWorker(id: string): Promise<boolean> {
        let worker = await this.model.findById(id);
        if (!worker) {
            throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
        }

        await this.model.updateOne({ _id: id }, { $set: { isVerified: true, status: "Approved" } });
        return true;
    }

    async rejectedWorker(id: string): Promise<boolean> {
        let worker = await this.model.findById(id);
        if (!worker) {
            throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
        }

        await this.model.updateOne({ _id: id }, { $set: { isVerified: false, status: "Rejected" } });
        return true;
    }

    async update(workerData: Partial<IWorker>): Promise<boolean> {
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
    }

    async search(searchTerms: Partial<IWork>): Promise<IWorker[]> {
        const query: any = {
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
    }

    async findById(id: string): Promise<IWorker> {
        const worker = await this.model.findById(id);
        if (!worker) throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
        return worker;
    }

    async findWorkersByIds(workerIds: string[]): Promise<IWorker[]> {
        const workers = await this.model.find({ _id: { $in: workerIds } });
        return workers;
    }

}
