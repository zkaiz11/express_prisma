const { PrismaClient } = require("@prisma/client");
const removePassword = require("../helper/removePassword");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();


//user change password by themselves
const passwordChangeUser = async (req,res) => {
    const {oldPassword, newPassword1, newPassword2} = req.body;
    try {
      if (!oldPassword || !newPassword1 || !newPassword2) {
        res.status(400);
        throw new Error("Passwords are required");
      }
      if (newPassword1!=newPassword2){
        res.status(400);
        throw new Error("Passwords do not match");
      }
      //get user from db
      const user = await prisma.user.findUniqueOrThrow({
        where:{
          id: req.user.id
        }
      })
      const pwChecking = await bcrypt.compare(oldPassword, user.password);
      if (!pwChecking) throw new Error("Incorrect password");
      const hashedPassword = await bcrypt.hash(newPassword1, 10);
      //update pw in db
      const updatedUser = await prisma.user.update({
        where:{
          id: req.user.id
        },
        data: {
          password: hashedPassword
        }
      });
      res.status(200).json({msg: "Password changed"})
    } catch (error) {
      res.status(400).json({msg: error.message})
    }
  }

//change password by admin

const resetPassword = async (req, res) => {
    const { newPassword1, newPassword2} = req.body;
    const user_id = parseInt(req.params.id)
    try {
        if (!newPassword1, !newPassword2) throw new Error("New password is required")
        if (newPassword1 != newPassword2) throw new Error("Password does not match")
        const hashedPassword = await bcrypt.hash(newPassword1, 10);
        const updatedUser = await prisma.user.update({
            where: {
                id: user_id
            },
            data: {
                password: hashedPassword
            }
        })
        res.status(200).json({msg:"Password Changed"})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
}

module.exports = {
    passwordChangeUser,
    resetPassword
}