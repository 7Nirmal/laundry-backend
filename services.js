import express from "express";
import {client} from "./index.js";
import { ObjectId } from "mongodb";


const router = express.Router();


router.post("/createservice",async function (req,res){
    console.log(req.body);
    try{
const data = await  client.db("laundry").collection("services").insertOne(req.body)
res.send(data);
    }
    catch (err){
        console.log(err);
res.json(err.message)
    }
})

router.get("/all-services",async function (req,res){
    try{
const data = await client.db("laundry").collection("services").find({}).toArray();
res.send(data);
    }
    catch{
console.log(err);
res.json(err.message);
    }
})

router.post("/new-category",async function (req,res){
    try{
const data = await client.db("laundry").collection("category").insertOne(req.body);
res.send(data);
    }
    catch(err){
        res.json(err.message);
    }
})

router.get("/getcateogryservices/:id",async function (req,res){
    const {id} = req.params;
    console.log(id);
    try{
const data = await client.db("laundry").collection("category").find({serviceId:id}).toArray();
res.send(data);
    }
    catch (err){
        res.json(err.message);  
    }
})


router.get("/getservice/:id",async function (req,res){
    const {id} = req.params;
    console.log(id);
    try{
const data = await client.db("laundry").collection("services").findOne({_id:ObjectId(id)})
res.send(data);
    }
    catch (err){
        res.json(err.message);  
    }
})

// router.post("/dummy",async function (req,res){
//     const id = "633016e8cfc51dc21cfadc9e";
//     try{
//         const catdata = await client.db("laundry").collection("category").find({serviceId:id}).toArray();
// // const data = await client.db("laundry").collection("products").insertOne({...req.body,rate:parseFloat(req.body.rate)});
// res.send(catdata);
//     }
//     catch(err){
//         res.json(err.message);
//     }
// })


router.post("/addproducts",async function (req,res){
    try{
 const data = await client.db("laundry").collection("products").insertOne({...req.body,rate:parseFloat(req.body.rate)});
res.send(data);
    }
    catch(err){
        res.json(err.message);
    }
})

router.get("/getallproductsbyservice/:id",async function (req,res){
    const {id} = req.params;
    console.log(id);
    try{
const data = await client.db("laundry").collection("products").aggregate([
    {
        $match:{
            serviceId:id
        }
    },
    {
        $group:{
            "_id":"$catId",
            "catName":{"$first":"$catName"},
            "serviceName":{"$first":"$serviceName"},
            "products":{
                $push:{
                    "_id":"$_id",
                    "name":"$name",
                    "rate":"$rate",
                    "catId":"$catId",
                    "catName":"$catName",
                    "serviceId":"$serviceId",
                    "serviceName":"$serviceName"
                }
            }
            }
        }
]).toArray();
res.send(data);
    }
    catch (err){
        res.json(err.message);  
    }
})


router.post("/addextras",async function (req,res){
    try{
 const data = await client.db("laundry").collection("extras").insertOne({...req.body,rate:parseFloat(req.body.rate)});
res.send(data);
    }
    catch(err){
        res.json(err.message);
    }
})


router.get("/getextras",async function (req,res){
    try{
        const data = await client.db("laundry").collection("extras").find({}).toArray();
        res.send(data);
    }
    catch(err){
        res.json(err.message);
    }
});

router.post("/deliverymethods",async function(req, res) {
    try{
        const data = await client.db("laundry").collection("deliveryMethods").insertOne(req.body);
        res.send(data);

    }
    catch(err){
        res.json(err.message)
    }
})

router.get("/getDeliveryMethods",async function  (request, response) {
    const data = await client.db("laundry").collection("deliveryMethods").find({}).toArray();
    response.send(data)
})


router.get("/adminGetAllServices", async(request, response)=>{
    const data = await client.db("laundry").collection("services").find({}).toArray();
    response.send(data)
})

router.get("/adminGetAllCategoriesForService/:id", async (request, response)=>{
    const {id} = request.params
    const data = await client.db("laundry").collection("category").find({serviceId:id}).toArray()
    response.send(data)
})

router.get("/adminGetAllProductsForCategory/:id", async (request, response)=>{
    const {id} = request.params
    const data = await client.db("laundry").collection("products").find({catId:id}).toArray()
    response.send(data)
})

router.delete("/adminDeleteProduct/:id",async(request, response)=>{
    const {id} = request.params
    const data = await client.db("laundry").collection("products").deleteOne({_id:ObjectId(id)})
    response.send(data)
})

router.get("/adminGetProductById/:id",async(request, response)=>{
    const {id} = request.params
    const data =  await client.db("laundry").collection("products").findOne({_id:ObjectId(id)})
    response.send(data)
})


router.put("/adminUpdateProductById/:id", async(request, response)=>{
    const {id} = request.params
    const data = await client.db("laundry").collection("products").updateOne({_id:ObjectId(id)},{$set:{name:request.body.name, rate:parseFloat(request.body.rate)}})
    response.send(data)
})
 export const servicerouter = router;