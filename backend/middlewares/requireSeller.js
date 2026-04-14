import User from "../models/User.js";

const requireSeller = async (req, res, next) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ success: false, message: "Seller access only" });
    }

    const user = await User.findById(req.user.id).select("sellerStatus");

    if (user.sellerStatus !== "approved") {
      return res.status(403).json({ success: false, message: "Seller not approved yet" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Authorization error" });
  }
};

export default requireSeller;