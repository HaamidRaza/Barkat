import User from "../models/User.js";
import Product from "../models/Product.js";
import Seller from "../models/Seller.js";
import CommunityRecipe from "../models/CommuntiyRecipe.js";
import jwt from "jsonwebtoken";

export const isAdminAuth = async (req, res) => {
  try {
    return res.json({ success: true, email: req.admin.email });
  } catch (e) {
    console.log(e.message);
    res.json({ succes: false, message: e.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json({ success: true, products });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const getAllCommunityRecipes = async (req, res) => {
  try {
    const recipes = await CommunityRecipe.find()
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, recipes });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const getPendingSellers = async (req, res) => {
  try {
    const sellers = await User.find({ sellerStatus: "pending" }).select(
      "-password",
    );
    res.json({ success: true, sellers });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const approveSeller = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, {
      role: "seller",
      sellerStatus: "approved",
    });
    await Seller.findOneAndUpdate({ userId }, { status: "approved" });
    res.json({ success: true, message: "Seller approved" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// Replace rejectSeller:
export const rejectSeller = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndUpdate(userId, {
      role: "user",
      sellerStatus: "rejected",
    });
    await Seller.findOneAndUpdate({ userId }, { status: "rejected" });
    res.json({ success: true, message: "Seller rejected" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
