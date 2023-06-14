const express = require("express");
const { 
    getAllUser, 
    getUser, 
    editUser,
    deleteUser,
    createUser,
    getCurrentUser
} = require("../controllers/userController");
const verifyRole = require("../middleware/verifyRole");
const router = express.Router();

router.get("/getcurrent", getCurrentUser);
router.route("/").get(verifyRole("ADMIN"), getAllUser).post(verifyRole("ADMIN"), createUser);
router.route("/:id").get(verifyRole("ADMIN"), getUser).patch(verifyRole("ADMIN"), editUser).delete(verifyRole("ADMIN"), deleteUser);


module.exports = router;
