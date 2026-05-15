const express = require("express");

const router = express.Router();

const {
    protect,
    admin,
} = require("../middleware/authMiddleware");

const {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus,
} = require("../controllers/orderController");


// CREATE ORDER
router.post("/", protect, createOrder);


// GET LOGGED IN USER ORDERS
router.get("/myorders", protect, getMyOrders);


// UPDATE ORDER STATUS
router.put(
    "/:id/status",
    protect,
    admin,
    updateOrderStatus
);


// GET ALL ORDERS (ADMIN)
router.get(
    "/",
    protect,
    admin,
    getOrders
);


module.exports = router;