import * as express from "express";
import { UserRoutes } from "./routes";

export class UserRouter {
    router: express.Router;
    constructor(){
        this.router = express.Router();
        this.router.get("/", UserRoutes.getAllUsers);
        this.router.post("/", UserRoutes.create);
        this.router.get("/:id", UserRoutes.getOne);
        this.router.put("/:id", UserRoutes.updateOne);
        this.router.delete("/:id", UserRoutes.hardRemove);
    }
}