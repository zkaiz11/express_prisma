const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const removePassword = require("../helper/removePassword")

const prisma = new PrismaClient();



const register = async (req, res) => {
  const { username, password1, password2 } = req.body;
  try {
    if (!username || !password1 || !password2) {
      res.status(400);
      throw new Error("Username and Password is required");
    }
    if (password1!=password2){
      res.status(400);
      throw new Error("Passwords do not match");
    }
    // find if the username is taken
    const foundExistingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (foundExistingUser) throw new Error("Username is already taken");
    // Hash password
    const hashedPassword = await bcrypt.hash(password1, 10);
    const user = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    const userWithoutPassword = removePassword(user, ["password", "is_deleted", "is_active", "created_at"]);
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      res.status(400);
      throw new Error("Username and password are required");
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        username: username,
      },
    });
    const pwChecking = await bcrypt.compare(password, user.password);
    if (!pwChecking) throw new Error("Incorrect password");
    const accessToken = jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
      },
      `${process.env.ACCESS_TOKEN_SECERT}`,
      { expiresIn: "7d" }
    );
    res.status(200).json({'accessToken': accessToken});
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { register, login };
