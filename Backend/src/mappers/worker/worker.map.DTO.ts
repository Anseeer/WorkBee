import { IWorker } from "../../model/worker/worker.interface";
import { IWorkerDTO, IWorkerEntity } from "./worker.map.DTO.interface";

function mapWorkerToDTO(worker: IWorker): IWorkerDTO {
    return {
        id: worker._id ? worker._id.toString() : "",
        _id: worker.id,
        name: worker.name || "",
        email: worker.email || "",
        phone: worker.phone || "",
        role: worker.role || "",
        workType: worker.workType || [],
        preferredSchedule: worker.preferredSchedule || [],
        isActive: worker.isActive ?? false,
        isVerified: worker.isVerified ?? false,
        status: worker.status,
        radius: worker.radius,
        completedWorks: worker.completedWorks,
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
        profileImage: worker.profileImage || "",
        govId: worker.govId,
        ratings: {
            average: worker.ratings.average,
            ratingsCount: worker.ratings.ratingsCount,
        },
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
        createdAt: worker.createdAt
    };
}


export function mapWorkerToEntity(worker: Partial<IWorker>): IWorkerEntity {
    return {
        id: worker._id ? worker._id.toString() : "",
        _id: worker.id,
        name: worker.name ?? "",
        email: worker.email ?? "",
        phone: worker.phone ?? "",
        password: worker.password,
        role: worker.role ?? "Worker",
        workType: worker.workType ?? [],
        preferredSchedule: worker.preferredSchedule ?? [],
        isActive: worker.isActive ?? true,
        isVerified: worker.isVerified ?? false,
        status: worker.status ?? "Pending Approval",
        radius: worker.radius ?? 0,
        completedWorks: worker.completedWorks ?? 0,
        isAccountBuilt: worker.isAccountBuilt ?? false,
        location: worker.location
            ? {
                address: worker.location.address ?? "",
                pincode: worker.location.pincode ?? "",
                lat: worker.location.lat ?? 0,
                lng: worker.location.lng ?? 0,
            }
            : { address: "", pincode: "", lat: 0, lng: 0 },
        services: worker.services ?? [],
        categories: worker.categories ?? [],
        age: worker.age ?? 0,
        bio: worker.bio ?? "",
        profileImage: worker.profileImage ?? "",
        govId: worker.govId ?? [],
        subscription: worker.subscription
            ? {
                plan: worker.subscription.plan.toString(),
                startDate: worker.subscription.startDate,
                endDate: worker.subscription.endDate,
                isActive: worker.subscription.isActive,
            }
            : null,
        createdAt: worker.createdAt ?? new Date(),
    };
}



export default mapWorkerToDTO;