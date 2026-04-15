import express from "express";
import { upload } from "../config/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProducts,
  changeStock,
  deleteProduct,
  getAllProducts,
  productById,
  productList,
  updateProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", authSeller, upload.array("images"), addProducts);
productRouter.get("/list", authSeller, productList); 
productRouter.get("/all", getAllProducts); 
productRouter.post("/id", productById);
productRouter.post("/update", authSeller, updateProduct);
productRouter.post("/stock", authSeller, changeStock);
productRouter.post("/delete", authSeller, deleteProduct);

export default productRouter;
