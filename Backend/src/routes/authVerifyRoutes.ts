import express, { Request, Response } from "express";
import { auth } from "../middlewares/authMiddleware";

const Router = express.Router();

Router.get("/verify", auth, (req: Request, res: Response) => {
    res.json({ status: 200, message: "Authenticated" });
});

export default Router;