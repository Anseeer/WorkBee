import { ObjectId } from "mongoose"
import { IWork } from "../../model/work/work.interface"
import { IWorkDTO, IWorkEntity } from "./work.map.DTO.interface"
import { ILocation } from "../../model/location/location.interface"

export const mapWorkToDTO = (work: Partial<IWork>): IWorkDTO => {
    return {
        _id: work.id,
        userId: work.userId as ObjectId,
        workerId: work.workerId as ObjectId,
        serviceId: work.serviceId as ObjectId,
        categoryId: work.categoryId as ObjectId,
        paymentId: work.paymentId as ObjectId,
        service: work.service as string,
        category: work.category as string,
        workerName: work.workerName as string,
        userName: work.userName as string,
        wage: work.wage as string,
        platformFee: work.platformFee as string,
        commission: work.commission as string,
        totalAmount: work.totalAmount as string,
        location: work.location as ILocation,
        workType: work.workType as string,
        size: work.size as string,
        description: work.description as string,
        sheduleDate: work.sheduleDate as string,
        sheduleTime: work.sheduleTime as string,
        status: work.status as string,
        paymentStatus: work.paymentStatus as string,
        isCompleted: work.isCompleted as boolean,
        createdAt: work.createdAt as Date,
    }
}

export const mapWorkToEntity = (work: Partial<IWork>): IWorkEntity => {
    return {
        _id: work.id,
        userId: work.userId as ObjectId,
        workerId: work.workerId as ObjectId,
        serviceId: work.serviceId as ObjectId,
        categoryId: work.categoryId as ObjectId,
        paymentId: work.paymentId as ObjectId,
        service: work.service as string,
        category: work.category as string,
        workerName: work.workerName as string,
        userName: work.userName as string,
        wage: work.wage as string,
        platformFee: work.platformFee as string,
        commission: work.commission as string,
        totalAmount: work.totalAmount as string,
        location: work.location as ILocation,
        workType: work.workType as string,
        size: work.size as string,
        description: work.description as string,
        sheduleDate: work.sheduleDate as string,
        sheduleTime: work.sheduleTime as string,
        status: work.status as string,
        paymentStatus: work.paymentStatus as string,
        isCompleted: work.isCompleted as boolean,
    }
}
