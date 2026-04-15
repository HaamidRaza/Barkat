import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Place Order COD
export const placeOrderCOD = async (req, res) => {
  try {
    const { items, address, amount } = req.body;
    const userId = req.user.id;

    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });

    return res.json({ success: true, message: "Order Placed!" });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

// get Orders by userID
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// get all orders
export const getAllOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    // Get all product IDs belonging to this seller
    const sellerProducts = await Product.find({ seller: sellerId }).select(
      "_id",
    );
    const sellerProductIds = sellerProducts.map((p) => p._id.toString());

    // Get orders that contain at least one seller product
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
      "items.product": { $in: sellerProductIds },
    })
      .populate("items.product")
      .populate("address")
      .sort({ createdAt: -1 });

    // Filter items within each order to only show this seller's products
    const filtered = orders.map((order) => ({
      ...order.toObject(),
      items: order.items.filter((item) =>
        sellerProductIds.includes(item.product?._id?.toString()),
      ),
    }));

    res.json({ success: true, orders: filtered });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId, isPaid } = req.body;
    await Order.findByIdAndUpdate(orderId, { isPaid });
    res.json({ success: true, message: "Payment status updated" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// Razor Pay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// verify payment
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    await Order.create({
      ...orderData,
      userId: req.user.id,
      paymentType: "Online",
      isPaid: true,
    });

    res.json({ success: true, message: "Payment successful! Order placed." });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
