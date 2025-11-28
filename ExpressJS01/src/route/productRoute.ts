// routes/productRoute.ts
import express from "express";
import {
  getProducts,
  createProduct,
  syncProduct,
} from "../controller/productController";
import { globalLimiter, authLimiter } from "../middleware/rateLimiter";
import {
  getProductsValidation,
  createProductValidation,
} from "../middleware/validation";
import { authenticateJwt } from "../middleware/authJWT";
import { authorize } from "../middleware/authorize";

const productRoute = express.Router();

productRoute.get(
  "/products",
  globalLimiter,
  getProductsValidation,
  getProducts
);

productRoute.get("/products/sync", globalLimiter, syncProduct);

productRoute.post(
  "/products",
  authLimiter,
  authenticateJwt,
  authorize(["user"]),
  createProductValidation,
  createProduct
);

export default productRoute;
