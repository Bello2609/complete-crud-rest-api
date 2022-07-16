const express = require("express");
const productController = require("../controller/product");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/product", productController.getProduct);

router.get("/product/:productId", productController.byIdProduct);

router.post("/product", checkAuth, productController.postProduct);

router.patch("/product/:productId", productController.patchProduct);

router.delete("/product/:productId", productController.deleteProduct);

module.exports = router;
