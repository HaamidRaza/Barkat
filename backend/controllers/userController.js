import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

// register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true, //prevents js to access cookie
      secure: process.env.NODE_ENV === "production", // use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res.json({
      success: true,
      user: { email: user.email, name: user.name, role: user.role },
    });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Emails and Password is Required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isAdmin =
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD;

    if (isAdmin) {
      // Admin token
      const adminToken = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("adminToken", adminToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // User token — so admin can shop, review, submit recipes etc.
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Seller token — so admin can access seller panel
      const sellerToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("sellerToken", sellerToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        isAdmin: true,
        user: { email: user.email, name: user.name, role: user.role },
        message: "Admin login successful",
      });
    }

    if (type === "seller" && user.role !== "seller") {
      return res.json({
        success: false,
        message: "You are not registered as a seller",
      });
    }

    if (type === "admin" && user.role !== "admin") {
      return res.json({ success: false, message: "Not an admin account" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true, //prevents js to access cookie
      secure: process.env.NODE_ENV === "production", // use secure cookie in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res.json({
      success: true,
      isAdmin: false,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        sellerStatus: user.sellerStatus,
      },
    });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

//become a seller
export const becomeSeller = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopName, phone, address } = req.body;

    // check if already applied
    const existing = await Seller.findOne({ userId });

    if (existing) {
      return res.json({
        success: false,
        message: "Already applied",
      });
    }

    const seller = await Seller.create({
      userId,
      shopName,
      phone,
      address,
    });
    await User.findByIdAndUpdate(userId, { sellerStatus: "pending" });
    return res.json({
      success: true,
      message: "Application submitted",
      seller: {
        user: seller.userId,
        shopName: seller.shopName,
        number: seller.phone,
        address: seller.address,
      },
    });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// Check Auth
export const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    return res.json({ success: true, user });
  } catch (e) {
    res.json({ success: false, message: "Not authenticated" });
  }
};

//logout user
export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};
