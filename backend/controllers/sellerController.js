import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const sellerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "Email and Password are Required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    // Check seller status
    if (user.sellerStatus !== "approved") {
      return res.json({
        success: false,
        message: user.sellerStatus === "pending"
          ? "Your application is pending approval"
          : "Seller account not approved",
      });
    }

    // Get seller profile
    const seller = await Seller.findOne({ userId: user._id });
    if (!seller) return res.json({ success: false, message: "Seller profile not found" });

    const token = jwt.sign(
      { id: user._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("sellerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      seller: {
        id: user._id,
        name: user.name,
        email: user.email,
        shopName: seller.shopName,
      },
    });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const isSellerAuth = (req, res) => {
  try {
    return res.json({
      success: true,
      seller: req.seller,
    });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export const sellerLogout = (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};