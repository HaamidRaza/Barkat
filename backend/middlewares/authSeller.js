import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  if (!sellerToken) {
    return res.json({ success: false, message: "Not authorized" });
  }
  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.sellerStatus !== "approved") {
      return res.json({ success: false, message: "Not authorized" });
    }

    req.seller = { id: user._id, name: user.name, email: user.email };
    next();
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

export default authSeller;