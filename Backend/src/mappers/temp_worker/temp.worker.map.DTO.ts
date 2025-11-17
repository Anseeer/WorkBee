import { ILocation } from "../../model/location/location.interface";
import { ITempWorker } from "../../model/temp_worker/temp.worker.interface";
import { ITempWorkerDTO, ITempWorkerEntity } from "./temp.worker.map.DTO.interface";

export const mapTempWorkerToDTO = (worker: ITempWorker): ITempWorkerDTO => {
    return {
        id: worker._id as string,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        otp: worker.otp,
        password: worker.password,
        location: worker.location,
        categories: worker.categories,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt,
    }
}

export const mapToTempWorkerEntity = (worker: Partial<ITempWorker>): ITempWorkerEntity => {
    return {
        id: worker._id as string,
        name: worker.name as string,
        email: worker.email as string,
        phone: worker.phone as string,
        otp: worker.otp as string,
        password: worker.password as string,
        location: worker.location as ILocation,
        categories: worker.categories as [],
        createdAt: worker.createdAt as Date,
        updatedAt: worker.updatedAt as Date,
    }
};
