import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { successResponse , errorResponse } from "../utilities/response";
import { Console } from "console";

export class UserController{
    private userService:UserService;
    constructor(userService:UserService){
        this.userService = userService
    }

    register = async (req:Request,res:Response)=>{
        try {
            console.log("Req:",req.body);
            
            let {newUser,token} = await this.userService.registerUser(req.body);
            let response = new successResponse(201,'User Registration SuccessFull',{newUser,token});
            res.status(response.status).json(response);
        } catch (error:any) {
            let response = new errorResponse(400,'User Registration Faild',error.message);
            console.log("Error",response)
            res.status(response.status).json(response);
        }
    }

    login = async (req:Request,res:Response)=>{
       try {
        const {email,password} = req.body;
        const {user,token} = await this.userService.loginUser(email,password);
        const response = new successResponse(201,'SuccessFully Login',{user,token});
        res.status(response.status).json(response);
       } catch (error:any) {
        const response = new errorResponse(400,'Faild To Login',error.message);
        res.status(response.status).json(response);
       }
    }

    
}