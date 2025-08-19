import express, { Response } from "express";
import { auth, AuthRequest } from "../middlewares/authMiddleware";

const Router = express.Router();

Router.get("/verify", auth, (req: AuthRequest, res: Response) => {
  res.json({
    status: 200,
    message: "Authenticated",
    role: req.user?.role
  });
});

export default Router;