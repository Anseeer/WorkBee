import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { Availability } from "../../model/availablity/availablity.model";
import BaseRepository from "../base/base.repo";
import { IAvailabilityRepository } from "./availability.repo.interface";

@injectable()
export class AvailabilityRepository extends BaseRepository<IAvailability> implements IAvailabilityRepository{
    constructor(){
        super(Availability)
    }

    findByWorkerId = async (id: string): Promise<IAvailability[] | null> =>{
        return await this.model.findOne({workerId:id});
    }
}