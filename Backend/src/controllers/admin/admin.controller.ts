import { Request, Response } from "express";
import { AdminService } from "../../services/admin/admin.service";
import { errorResponse, successResponse } from "../../utilities/response";
import logger from "../../utilities/logger";
import { IAdminController } from "./admin.controller.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";

@injectable()
export class AdminController implements IAdminController {
    private _adminService: AdminService;
    constructor(@inject(TYPES.adminService) adminService: AdminService) {
        this._adminService = adminService;
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new Error("Email and Password are required !");
            }
            const { token, admin } = await this._adminService.login(req.body);
            const response = new successResponse(200, "Admin Login Successfull", { admin });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
            })
            res.status(response.status).json(response);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Login Faild", errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    logout = async (req: Request, res: Response): Promise<void> => {
        try {
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Logout Failed", errMsg);
            logger.error(response);
            res.status(response.status).json(response);
        }
    };


    fetchUsers = async (req: Request, res: Response) => {
        try {
            const users = await this._adminService.fetchUsers();
            const response = new successResponse(200, "Successfully get all users", users);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed to fetch users", message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    setIsActiveUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.query.id as string;
            await this._adminService.setIsActiveUsers(id);
            let response = new successResponse(200, "Update status successfully", {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed to set status of users", message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    setIsActiveWorkers = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.query.id as string;
            await this._adminService.setIsActiveWorkers(id);
            let response = new successResponse(200, "Update status successfully", {});
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed to set status of workers", message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchWorkers = async (req: Request, res: Response): Promise<void> => {
        try {
            const workers = await this._adminService.fetchWorkers();
            const response = new successResponse(200, "Successfully get all workers", workers);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed to fetch workers", message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    fetchAvailability = async (req: Request, res: Response): Promise<void> => {
        try {
            const {workerId} = req.query;
            const availability = await this._adminService.fetchAvailability(workerId as string);
            const response = new successResponse(200, "Successfully get availability", availability);
            logger.info(response);
            res.status(response.status).json(response);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const response = new errorResponse(400, "Failed to fetch availability", message);
            logger.error(response);
            res.status(response.status).json(response);
        }
    }

    
}