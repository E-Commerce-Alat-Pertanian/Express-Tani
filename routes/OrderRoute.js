const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/VerifyToken")
const OrderController = require("../controllers/OrderController")

router.post("/", verifyToken, OrderController.createOrder)

module.exports = router