const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    createOrder,
    getMyOrders,
    getOrders,
} = require("../controllers/orderController");


// CREATE ORDER
router.post("/", protect, createOrder);


// GET LOGGED IN USER ORDERS
router.get("/myorders", protect, getMyOrders);


// GET ALL ORDERS (ADMIN)
router.get("/", protect, getOrders);


module.exports = router;