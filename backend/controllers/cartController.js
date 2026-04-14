import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItems } = req.body;
    await User.findByIdAndUpdate(userId, { cartItems });
    res.json({ success: true, message: "Cart Updated!" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};
