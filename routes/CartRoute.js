const express = require("express")
const router = express.Router()
const KeranjangController = require("../controllers/keranjang_controller")
const verifyToken = require("../middleware/VerifyToken")
// const { route } = require("./daerah_route")

router.get("/", verifyToken, KeranjangController.keranjangRiwayatByUser)
router.put("/", verifyToken, KeranjangController.updateKeranjang)
router.delete("/:idCart", verifyToken, KeranjangController.hapusKeranjang)


module.exports = router