import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { WORKER_MESSAGE } from "../../constants/messages";
import logger from "../../utilities/logger";
import { ITempWorker } from "../../model/temp_worker/temp.worker.interface";
import { ITempWorkerRepository } from "./temp.worker.interface.repo";
import TempWorker from "../../model/temp_worker/temp.worker.mode;";

@injectable()
export class TempWorkerRepository extends BaseRepository<ITempWorker> implements ITempWorkerRepository {
    constructor() {
        super(TempWorker);
    }

    async findTempWorkerByEmail(email: string): Promise<ITempWorker | null> {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            logger.error("Error in findByEmail:", error);
            throw new Error('Error in findByEmail');
        }
    }

    async updateById(workerId: string, updateData: Partial<ITempWorker>): Promise<ITempWorker | null> {
        try {
            const updatedWorker = await this.model.findByIdAndUpdate(workerId, updateData, { new: true }).exec();
            if (!updatedWorker) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            return updatedWorker;
        } catch (error) {
            logger.error("Error in updateById:", error);
            throw new Error('Error in updateById');
        }
    }

}