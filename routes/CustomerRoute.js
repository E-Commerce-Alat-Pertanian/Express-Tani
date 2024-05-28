const express = require("express");
const { getCustomers, Register, Login, Logout, getProfile, updateProfile, updateAddress } = require("../controllers/CustomerController.js");
const verifyToken = require("../middleware/VerifyToken.js");
const refreshToken = require("../controllers/RefreshToken.js");
const DaerahController = require("../controllers/daerah_controller");
const { route } = require("./UserRoute.js");
const router = express.Router();

router.get("/profile", verifyToken, getProfile );
router.get('/customers', verifyToken, getCustomers);
router.put('/update-profile', verifyToken, updateProfile);
router.put('/update-addres', verifyToken, updateAddress);
router.post('/register', Register);
router.post('/login-customer', Login);
router.get('/token', refreshToken);
router.get('/logout-customer', verifyToken, Logout);

module.exports = router;