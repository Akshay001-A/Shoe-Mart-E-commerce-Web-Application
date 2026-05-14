const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createOrder,
    getMyOrders,
} = require("../controllers/orderController");

router.post("/", protect, createOrder);

router.get("/myorders", protect, getMyOrders);

module.exports = router;