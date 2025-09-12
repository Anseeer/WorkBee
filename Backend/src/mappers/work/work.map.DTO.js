"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapWorkToEntity = exports.mapWorkToDTO = void 0;
const mapWorkToDTO = (work) => {
    return {
        _id: work.id,
        userId: work.userId,
        workerId: work.workerId,
        serviceId: work.serviceId,
        categoryId: work.categoryId,
        paymentId: work.paymentId,
        service: work.service,
        category: work.category,
        workerName: work.workerName,
        userName: work.userName,
        wage: work.wage,
        location: work.location,
        workType: work.workType,
        size: work.size,
        description: work.description,
        sheduleDate: work.sheduleDate,
        sheduleTime: work.sheduleTime,
        status: work.status,
        paymentStatus: work.paymentStatus,
        isCompleted: work.isCompleted,
        createdAt: work.createdAt,
    };
};
exports.mapWorkToDTO = mapWorkToDTO;
const mapWorkToEntity = (work) => {
    return {
        _id: work.id,
        userId: work.userId,
        workerId: work.workerId,
        serviceId: work.serviceId,
        categoryId: work.categoryId,
        paymentId: work.paymentId,
        service: work.service,
        category: work.category,
        workerName: work.workerName,
        userName: work.userName,
        wage: work.wage,
        location: work.location,
        workType: work.workType,
        size: work.size,
        description: work.description,
        sheduleDate: work.sheduleDate,
        sheduleTime: work.sheduleTime,
        status: work.status,
        paymentStatus: work.paymentStatus,
        isCompleted: work.isCompleted,
    };
};
exports.mapWorkToEntity = mapWorkToEntity;
