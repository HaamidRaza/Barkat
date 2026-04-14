import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  createRazorpayOrder,
  getAllOrders,
  getUserOrders,
  placeOrderCOD,
  updateOrderStatus,
  updatePaymentStatus,
  verifyPayment,
} from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.get("/user", authUser, getUserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);
orderRouter.patch("/status", authSeller, updateOrderStatus);
orderRouter.patch("/payment-status", authSeller, updatePaymentStatus);
orderRouter.post("/razorpay", authUser, createRazorpayOrder);
orderRouter.post("/verify", authUser, verifyPayment);
export default orderRouter;    