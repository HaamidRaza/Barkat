import express from "express";
import {
    becomeSeller,
  isAuth,
  login,
  Logout,
  register,
} from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";
import requireSeller from "../middlewares/requireSeller.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/become-seller",authUser, becomeSeller);
userRouter.get("/auth", authUser, isAuth);
userRouter.get("/logout", authUser, Logout);
userRouter.get("/seller/dashboard", authUser, requireSeller, (req, res) => {
  res.json({ success: true, message: "Welcome Seller" });
});
export default userRouter;
