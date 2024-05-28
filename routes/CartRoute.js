const express = require("express")
const router = express.Router()
const KeranjangController = require("../controllers/keranjang_controller")
const verifyToken = require("../middleware/VerifyToken")

router.get("/", verifyToken, KeranjangController.keranjangRiwayatByUser)
router.put("/", verifyToken, KeranjangController.updateKeranjang)

module.exports = router