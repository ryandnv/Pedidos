const express = require("express");
const {
  createOrder,
  getOrderById,
  listOrders,
  updateOrder,
  removeOrder
} = require("../controllers/apiOrdersController");

const router = express.Router();

router.post("/order", createOrder);
router.get("/order/list", listOrders);
router.get("/order/:orderId", getOrderById);
router.put("/order/:orderId", updateOrder);
router.delete("/order/:orderId", removeOrder);

module.exports = router;