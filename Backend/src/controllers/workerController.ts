import { Request, Response } from "express";
import { workerUsecase } from "../usecase/worker";
import { errorResponse, successResponse } from "../utilities/response";
import logger from "../utilities/logger";


export class workerController {
    private workerUsecase: workerUsecase;
    constructor(workerUsecase: workerUsecase) {
        this.workerUsecase = workerUsecase
    }

    register = async (req: Request, res: Response) => {
        try {
            console.log("Registering Worker:", req.body);

            const { token, workerId } = await this.workerUsecase.registerWorker(req.body);

            const response = new successResponse(201, "Worker registration successful", {
                token,
                workerId
            });

            res.status(response.status).json(response);

        } catch (error: unknown) {
            logger.error("Worker registration failed:", error);

            console.error("Registration Error:", error);

            const errMsg = error instanceof Error ? error.message : String(error);

            const response = new errorResponse(400, "Failed to register worker", errMsg);

            res.status(response.status).json(response);
        }
    };


    createAccount = async (req: Request, res: Response) => {
        const { workerId } = req.query;

        try {
            if (!workerId || typeof workerId !== "string") {
                throw new Error("Worker ID is missing or invalid");
            }

            const { availability, ...workerData } = req.body;

            const result = await this.workerUsecase.createWorker(workerId, availability, workerData);

            const response = new successResponse(201, "Worker Account Build Successfully", {
                workerId: result.workerId
            });

            res.status(response.status).json(response);
        } catch (error: unknown) {
            const err = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed To Build Account", err);
            res.status(response.status).json(response);
        }
    }


}

