const express = require("express")
const DaerahController = require("../controllers/daerah_controller")
const { verifyUser } = require("../middleware/AuthUser")
const verifyToken = require("../middleware/VerifyToken")
const router = express.Router()

router.get("/provinsi", DaerahController.allProvinsi)
router.get("/kecamatan/:provinsi", DaerahController.kecamatanByProvinsi)
router.get("/kecamatan-by-id/:idKecamatan", DaerahController.getKecamatanById)
router.get("/provinsi-by-id/:idProvinsi", DaerahController.getProvinsiById)
router.get("/ongkir/:kurir", verifyToken, DaerahController.ongkir)

module.exports = router