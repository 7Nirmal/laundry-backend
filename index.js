import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {MongoClient} from "mongodb"
import { servicerouter } from "./services.js";
import {userrouter} from "./authenticate.js";
import {orderRouter} from "./order.js";
import Razorpay from "razorpay";




dotenv.config()

const app = express()
app.use(express.json());
const PORT = process.env.PORT

app.use(cors({origin:true}));
const MONGO_URL = process.env.MONGO_URL

async function createConnection(){
    const client = new MongoClient(MONGO_URL)
    await client.connect()
    console.log("mongodb connected")
    return client
}

export const client = await createConnection()

app.get("/", (request, response)=>{
    response.send("hai from laundry app")
})

let instance = new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET
  });
app.get("/orders/createOrder/:grandTotal", (request, response)=>{
    let {grandTotal} = request.params
    const amount = grandTotal * 100
    const currency = "INR"
    const receipt = "receipt#123"
    instance.orders.create({amount, currency, receipt}, (error, order)=>{
        if(error){
            return response.send({error:error.message})
        }else{
            
            return response.send(order)
        }
    })
})

app.use("/services",servicerouter)
app.use("/user",userrouter);
app.use("/orders",orderRouter);
app.listen(PORT, ()=>{
    console.log("app started at", PORT)
})