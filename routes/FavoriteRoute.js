const express = require("express");
const {
    getFavorite,
    getFavoriteById,
    createFavorite,
    deleteFavorite
} = require("../controllers/Favoritecontroller.js")

const verifyToken = require("../middleware/VerifyToken.js");

const router = express.Router()

router.get('/', getFavorite)
router.get('/:idfavorite', getFavoriteById)
router.post('/create-favorite', verifyToken, createFavorite)
router.delete('/:idfavorite', verifyToken, deleteFavorite)

module.exports = router;