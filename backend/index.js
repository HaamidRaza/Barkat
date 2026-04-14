import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import recipeRouter from "./routes/recipeRoute.js";
import reviewRouter from "./routes/reviewRoute.js";

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [process.env.VITE_URL || "http://localhost:5173"];

await connectDB();
await connectCloudinary()

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("API Works!");
});

app.use("/user", userRouter);
app.use("/seller", sellerRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);
app.use("/order", orderRouter);
app.use("/recipe", recipeRouter);
app.use("/review", reviewRouter);

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
