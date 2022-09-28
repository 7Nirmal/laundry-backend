import bcrypt from "bcrypt";
import {client} from "./index.js";

export async function getuserbyemail(email) {
    return await client.db("laundry").collection("users").findOne({ email: email });
}

export async function genPassword(password) {
    const NO_OF_ROUNDS = 10;
    const salt = await bcrypt.genSalt(NO_OF_ROUNDS);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  export async function createUser(data) {
    return await client.db("laundry").collection("users").insertOne(data);
}


 export async function placeOrder(order) {
    return await client.db("laundry").collection("orders").insertOne(order);
}

 export async function cancelRequest(id){
    return await client.db("laundry").collection("orders").deleteOne({"_id":ObjectId(id)})
}

 export async function getOrderDetailById(id){
    return await client.db("laundry").collection("orders").findOne({"_id":ObjectId(id)})
}

 export async function userGetOrders(userId){
    return await client.db("laundry").collection("orders").find({userId: userId}).sort({orderedAt: -1}).toArray()
}

 export async function getAllOrders(){
    return await client.db("laundry").collection("orders").find({}).sort({orderedAt: -1}).toArray()
}

 export async function getNewOrders(){
    return await client.db("laundry").collection("orders").find({orderStatus:{$in:["pickup requested", "laundry pickedup"]}}).sort({orderedAt: -1}).toArray()
}

 export async function getOnProgressOrders(){
    return await client.db("laundry").collection("orders").find({orderStatus:{$in:["on progress", "completed"]}}).toArray()
}

 export async function getCompletedOrders(){
    return await client.db("laundry").collection("orders").find({orderStatus: "delivered"}).toArray()
}

 export async function updateOrderStatus(id, stage){
    return await client.db("laundry").collection("orders").updateOne({"_id":ObjectId(id), "statusArray.stage":stage}, {$set:{"statusArray.$.isCompleted":"true", "statusArray.$.updatedAt":new Date().toISOString(), "orderStatus":stage, "orderUpdatedAt": new Date()}},{upsert:true})
}
