const express = require("express");
const {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    allProduk
} = require("../controllers/ProductController.js") 
const { verifyUser, adminOnly } = require("../middleware/AuthUser.js") 

const router = express.Router()

router.get('/product', getProduct)
router.get("/", allProduk)
router.get('/:idProduct', getProductById)
router.post('/product', verifyUser, adminOnly, createProduct)
router.patch('/product/:idProduct', updateProduct)
router.delete('/product/:idProduct', deleteProduct)

module.exports = router;