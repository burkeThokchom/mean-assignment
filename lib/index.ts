import * as express from "express";
import * as path from "path";
import * as http from "http";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as dotenv from "dotenv";
import { api } from "./routes/api";

try{

    const app = express();
    dotenv.config();

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    const options = {
        inflate: true,
        limit: 1000, 
        type: "text/plain"
    };
    app.use(bodyParser.raw(options));
    app.use(cors());

    app.use(express.static(path.join(__dirname, "../../dist/mean-crud")));
    //setting api routes
    app.use("/api", api);
    app.use('/test', (req, res)=>{
        res.json({status: "OK"});
    })

   // catch all other routes and serving the indexedDB.html file
    app.get("*", (req, res)=>{
        res.sendFile(path.join(__dirname, "../../dist/mean-crud/index.html"));
    })
    const port = process.env.PORT || "8000";
    app.set("port", port);
    const server = http.createServer(app);
    server.listen(port, ()=>{
        console.log(`API server liustening to port ${port}`)
    })
    
    module.exports = app;
    
} 
catch(error){
    console.log(error);
    // process.exit(1);
}

