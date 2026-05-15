const Order = require("../models/Order");
const Product = require("../models/Product");


// CREATE ORDER
const createOrder = async (req, res) => {

    try {

        const {
            orderItems,
            shippingAddress,
            totalPrice,
        } = req.body;

        const order = await Order.create({

            user: req.user._id,

            orderItems,

            shippingAddress,

            totalPrice,

        });
        for (const item of orderItems) {

    const product =
        await Product.findById(
            item.product
        );

    if (product) {

        if (
            product.countInStock <
            item.quantity
        ) {

            return res.status(400).json({
                message:
                    product.name +
                    " Out Of Stock",
            });

        }

        product.countInStock -=
            item.quantity;

        await product.save();

    }

}

        res.status(201).json(order);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// GET LOGGED IN USER ORDERS
const getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user._id,
        });

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// GET ALL ORDERS (ADMIN)
const getOrders = async (req, res) => {

    try {

        const orders = await Order.find({})
            .populate("user", "name email");

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


module.exports = {

    createOrder,

    getMyOrders,

    getOrders,

};