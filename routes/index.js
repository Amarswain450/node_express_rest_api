import express from "express";
const router = express.Router();
import {
  loginController,
  productController,
  refreshController,
  registerController,
  userController,
} from "../controllers";
import admin from "../middlewares/admin";
import auth from "../middlewares/auth";

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout", auth, loginController.logout);

router.post("/products", [auth, admin], productController.create);
router.put("/products/:id", [auth, admin], productController.update);
router.delete("/products/:id", [auth, admin], productController.destroy);
router.get("/products", productController.index);
router.get("/products/:id", productController.show);

export default router;
