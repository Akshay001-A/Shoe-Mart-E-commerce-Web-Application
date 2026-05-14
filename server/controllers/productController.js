const Product = require("../models/Product");


// CREATE PRODUCT
const createProduct = async (req, res) => {

    try {

        const product = await Product.create(req.body);

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// GET ALL PRODUCTS + SEARCH + FILTER
const getProducts = async (req, res) => {

    try {

        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};

        const brand = req.query.brand
            ? {
                  brand: req.query.brand,
              }
            : {};

        const category = req.query.category
            ? {
                  category: req.query.category,
              }
            : {};

        const products = await Product.find({
            ...keyword,
            ...brand,
            ...category,
        });

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// GET SINGLE PRODUCT
const getProductById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found",
            });

        }

        res.status(200).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// UPDATE PRODUCT
const updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found",
            });

        }

        product.name = req.body.name || product.name;
        product.brand = req.body.brand || product.brand;
        product.category = req.body.category || product.category;
        product.description =
            req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.image = req.body.image || product.image;
        product.countInStock =
            req.body.countInStock || product.countInStock;

        const updatedProduct = await product.save();

        res.status(200).json(updatedProduct);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


// DELETE PRODUCT
const deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found",
            });

        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product removed",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};


module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};