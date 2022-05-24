import { Users } from "../../db";
import * as express from "express";
import * as status from "http-status";
import { UserHelpers } from "./helpers";

export class UserRoutes{
    constructor(){}
    
    public static async create(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        try{
           
            const document = req.body.userData;
            const existingUser = await Users.findOne({email: document.email}).lean();
            if(existingUser){
                res.status(403).json({message: "User with this email already exists"})
            }
           
            const user  = await UserHelpers.create(document)
            res.json({data: user});
        }catch(err){
            next(err)
        }
    }

    public static async getAllUsers(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        try{
            const page:any = req.query.page ? req.query.page : 1;
            const limit:any = req.query.pageSize ? req.query.pageSize : 100;
            const searchValue:any = req.query.searchValue ? req.query.searchValue : "";

            const data = await UserHelpers.getAll({
                page, 
                limit,
                searchValue
            })
            res.json({data});
        }
        catch(error){
            next(error);
        }
    }

    public static async getOne(req, res, next){
        try{
           const id = req.params.id;
           const data = await UserHelpers.findById(id)
            res.json({ data });

        }catch(err){
            next(err)
        }
    }

    public static async hardRemove(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ){
        try{
            const id = req.params.id;
            await UserHelpers.hardDelete(id);
            res.status(201).json({message: "User Deleted"})
        }
        catch(error){
            next(error);
        }
    }

    public static async updateOne(req, res, next){
        try{
           const id = req.params.id;
           const doc = req.body.document;
           const data = await UserHelpers.updateOne(doc)
            res.json({ data });

        }catch(err){
            next(err)
        }
    }


}