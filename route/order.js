const express = require("express");
const router = express.Router();
const orderController = require("../controller/order");
const checkAuth = require("../middleware/check-auth");


router.get("/order", orderController.getOrder);

router.get("/order/:orderId", orderController.byIdOrder);

router.post("/order", checkAuth, orderController.postOrder);

router.patch("/order/:orderId", orderController.patchOrder);

router.delete("/order/:orderId", orderController.deleteOrder);

module.exports = router;
