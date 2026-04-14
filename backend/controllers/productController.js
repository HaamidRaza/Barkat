import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";

// Add product
export const addProducts = async (req, res) => {
  try {
    let productData = JSON.parse(req.body.productData);
    const images = req.files;
    let imageUrl = await Promise.all(
      images.map(async (i) => {
        let result = await cloudinary.uploader.upload(i.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );
    await Product.create({
      ...productData,
      image: imageUrl,
      seller: req.seller.id,
    });
    res.json({ success: true, message: "Product Added!" });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

// get products
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

// get single product
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

// update product
export const updateProduct = async (req, res) => {
  try {
    const { id, name, description, category, price, offerPrice } = req.body;
    await Product.findByIdAndUpdate(id, {
      name, description, category, price, offerPrice,
    });
    res.json({ success: true, message: "Product updated!" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};

// change product stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "Stock Updated!" });
  } catch (e) {
    console.log(e.message);
    res.json({ success: false, message: e.message });
  }
};

// delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (!product) return res.json({ success: false, message: "Product not found" });

    // Delete images from cloudinary
    await Promise.all(
      product.image.map((url) => {
        const publicId = url.split("/").pop().split(".")[0];
        return cloudinary.uploader.destroy(publicId);
      })
    );

    await Product.findByIdAndDelete(id);
    res.json({ success: true, message: "Product deleted!" });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
};