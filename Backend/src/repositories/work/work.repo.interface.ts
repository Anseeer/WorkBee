import { IWork } from "../../model/work/work.interface";

export interface IWorkRepository {
    create(workDetails: Partial<IWork>): Promise<IWork>;
    findByUser(userId:string):Promise<IWork[]>;
}