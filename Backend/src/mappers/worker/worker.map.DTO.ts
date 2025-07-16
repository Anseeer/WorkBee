import { IWorker } from "../../model/worker/worker.interface";
import { IWorkerDTO } from "./worker.map.DTO.interface";

const mapWorkerToDTO = (item: IWorker): IWorkerDTO => {
    return {
        id: item._id,
        subscription: item.subscription.isActive,
        name: item.name,
        email: item.email,
        phone: item.phone,
        role: item.role,
        workType: item.workType,
        preferredSchedule: item.preferredSchedule,
        isActive: item.isActive,
        isVerified: item.isVerified,
        location: item.location,
        services: item.services,
        categories: item.categories,
        age: item.age,
        bio: item.bio,
        minHour: item.minHours,
        profileImage: item.profileImage,
        govId: item.govId
    }
}
export default mapWorkerToDTO;