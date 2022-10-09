import express from "express"
import {
  placeOrder,
  getOrderDetailById,
  userGetOrders,
  getAllOrders,
  getNewOrders,
  getOnProgressOrders,
  getCompletedOrders,
  updateOrderStatus,
  cancelRequest,
} from "./helper.js";
const router = express.Router()

// laundry order

router.post("/placeOrder", async(request, response)=>{
    const userId = request.user.id

    const {orderDetails} = request.body
    
    const statusArray = [
        {
            "stage":"pickup requested",
            "isCompleted":"true",
        },
        {
            "stage":"laundry pickedup",
            "isCompleted":"false",
        },
        {
            "stage":"on progress",
            "isCompleted":"false",
        },
        {
            "stage":"completed",
            "isCompleted":"false",
        },
        {
            "stage":"delivered",
            "isCompleted":"false"
        }
    ]

    const result = await placeOrder({
      ...orderDetails,
      grandTotal: parseInt(orderDetails.grandTotal),
      subTotal: parseInt(orderDetails.subTotal),
      deliveryCharge: parseInt(orderDetails.deliveryCharge),
      pickupDate: new Date(
        parseInt(orderDetails.pickupDate) * 1000
      ).toISOString(),
      orderedAt: new Date(),
      orderStatus: "pickup requested",
      orderUpdatedAt: new Date(),
      statusArray: statusArray,
    });

    console.log(result)
    response.send(result)
})

router.route("/cancelRequest/:id")
.delete( async(request, response)=>{
    const {id} = request.params
    const result = await cancelRequest(id)
    response.send(result)
})

router.get("/getOrderDetail/:id", async(request, response)=>{
    const {id} = request.params
try{
    const result = await getOrderDetailById(id)
    response.send(result)
}
catch (err){
    response.json(err.message);
}


})

router.route("/adminGetOrderDetail/:id")
.get(async(request, response)=>{

    const {id} = request.params

    const result = await getOrderDetailById(id)

    response.send(result)
})

router.route("/userGetOrders")
.post( async(request, response)=>{
    const userId = request.body.id;
    console.log(userId)

    const result = await userGetOrders(userId)

    response.send(result)
})

router.route("/adminGetAllOrders")
.get( async(request, response)=>{
    const data = await getAllOrders()
    response.send(data)
})

router.route("/adminGetNewOrders")
.get( async(request, response)=>{
    const data = await getNewOrders()
    response.send(data)
})

router.route("/adminGetOnProgressOrders")
.get( async(request, response)=>{
    const data = await getOnProgressOrders()
    response.send(data)
})

router.route("/adminGetCompletedOrders")
.get( async(request, response)=>{
    const data = await getCompletedOrders()
    response.send(data)
})

router.route("/updateOrderStatus/:id")
.put( async(request, response)=>{
    const {id} = request.params
    const {stage} = request.body
    console.log(stage)
    const data = await updateOrderStatus(id, stage)
    response.send(data)
})

export const orderRouter = router