import { IWorker } from "../../model/worker/worker.interface";
import { IWorkerDTO } from "./worker.map.DTO.interface";

function mapWorkerToDTO(worker: IWorker): IWorkerDTO {
    return {
        id: worker._id ? worker._id.toString() : "",
        name: worker.name || "",
        email: worker.email || "",
        phone: worker.phone || "",
        role: worker.role || "",
        workType: worker.workType || [],
        preferredSchedule: worker.preferredSchedule || [],
        isActive: worker.isActive ?? false,
        isVerified: worker.isVerified ?? false,
        isAccountBuilt: worker.isAccountBuilt ?? false,
        location: worker.location
            ? {
                address: worker.location.address || "",
                pincode: worker.location.pincode || "",
                lat: worker.location.lat || 0,
                lng: worker.location.lng || 0,
            }
            : { address: "", pincode: "", lat: 0, lng: 0 },
        services: Array.isArray(worker.services)
            ? worker.services.map(s => s?.toString() || "")
            : [],
        categories: Array.isArray(worker.categories)
            ? worker.categories.map(c => c?.toString() || "")
            : [],
        age: worker.age || 0,
        bio: worker.bio || "",
        minHours: worker.minHours || "",
        profileImage: worker.profileImage || "",
        govId: worker.govId || "",
        subscription: worker.subscription
            ? {
                plan: worker.subscription.plan
                    ? worker.subscription.plan.toString()
                    : "",
                startDate: worker.subscription.startDate,
                endDate: worker.subscription.endDate,
                isActive: worker.subscription.isActive,
            }
            : null,
    };
}


export default mapWorkerToDTO;