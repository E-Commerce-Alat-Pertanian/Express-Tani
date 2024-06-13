const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/VerifyToken")
const {OrderController, uploadKurir, } = require("../controllers/OrderController")


router.post("/", verifyToken, OrderController.createOrder)
router.get("/", verifyToken, OrderController.getOrder);
router.patch("/order-kurir/:idOrder", uploadKurir);
router.patch("/:idOrder", OrderController.uploadPembayaran);

module.exports = router