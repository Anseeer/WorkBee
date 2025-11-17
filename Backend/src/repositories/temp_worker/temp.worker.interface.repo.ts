import { ITempWorkerEntity } from "../../mappers/temp_worker/temp.worker.map.DTO.interface";
import { ITempWorker } from "../../model/temp_worker/temp.worker.interface";
import { Iread } from "../base/base.repo.interface";

export interface ITempWorkerRepository extends Iread<ITempWorker> {
    create(worker: ITempWorkerEntity): Promise<ITempWorker>;
    findTempWorkerByEmail(email: string): Promise<ITempWorker | null>;
    updateById(workerId: string, updateData: Partial<ITempWorker>): Promise<ITempWorker | null>;
    delete(workerId: string): Promise<boolean>;
}
