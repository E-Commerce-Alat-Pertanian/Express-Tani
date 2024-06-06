const express = require("express");
const {
    getFavorite,
    getFavoriteById,
    createFavorite,
    deleteFavorite
} = require("../controllers/Favoritecontroller.js")

const verifyToken = require("../middleware/VerifyToken.js");

const router = express.Router()

router.get('/', verifyToken, getFavorite)
router.get('/:idfavorite', getFavoriteById)
router.post('/create-favorite', verifyToken, createFavorite)
router.delete('/:idFavorite', verifyToken, deleteFavorite)

module.exports = router;