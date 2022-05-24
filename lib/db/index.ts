import * as mongoose from "mongoose";
import { UserSchema } from "./UserSchema";
import * as dotenv from "dotenv";
dotenv.config();
//setting up db connection
mongoose.connect(process.env.DB_PATH);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "db connection error"));
db.on("open", ()=> console.log("connected to db: ", process.env.DB_PATH));

//defining models
export const Users = mongoose.model("Users", UserSchema);
