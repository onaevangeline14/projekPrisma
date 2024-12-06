import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from "../controller/orderController"
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"


const app = express()
app.use(express.json())
app.get(`/`, getAllOrders)
app.post(`/`, [verifyToken, verifyRole(["Cashier"]), verifyAddOrder], createOrder)
app.put(`/:id`, [verifyToken, verifyRole(["Cashier"]), verifyEditStatus], updateStatusOrder)
app.delete(`/:id`, [verifyToken, verifyRole(["Manager"])], deleteOrder)


export default app

