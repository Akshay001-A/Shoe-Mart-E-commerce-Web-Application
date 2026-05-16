const express = require("express");

const router = express.Router();

const multer = require("multer");

const upload = multer({
  dest: "uploads/",
});

const {

    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    imageSearchProducts,

} = require("../controllers/productController");


// IMAGE SEARCH ROUTE

router.post(

  "/image-search",

  upload.single("image"),

  imageSearchProducts

);


// CREATE PRODUCT

router.post("/", createProduct);


// GET ALL PRODUCTS

router.get("/", getProducts);


// GET SINGLE PRODUCT

router.get("/:id", getProductById);


// UPDATE PRODUCT

router.put("/:id", updateProduct);


// DELETE PRODUCT

router.delete("/:id", deleteProduct);


module.exports = router;