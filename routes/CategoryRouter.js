const express = require("express")
const router = express.Router()
const CategoriController = require("../controllers/CategoryController")

router.get("/", CategoriController.allKategori)

module.exports = router