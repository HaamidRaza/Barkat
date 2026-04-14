import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartItems: { type: Object, default: {} },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
    },
    sellerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
  },
  { minimize: false },
);

const User = mongoose.models.User || mongoose.model("user", userSchema);

export default User;
