import * as express from "express";
import { UserRouter } from "./users";

export const api = express.Router();
api.use("/users", new UserRouter().router);