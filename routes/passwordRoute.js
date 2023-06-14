const express = require("express");
const { passwordChangeUser, resetPassword } = require("../controllers/passwordController");
const verifyRole = require("../middleware/verifyRole");
const router = express.Router();

router.post('/', passwordChangeUser);
router.post('/:id',verifyRole("ADMIN") ,resetPassword);


module.exports = router;