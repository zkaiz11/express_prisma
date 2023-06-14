const { PrismaClient } = require("@prisma/client");
const removePassword = require("../helper/removePassword");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

//get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findFirstOrThrow(
      {
        where:{
          id: req.user.id
        },
        select:{
          username: true,
          first_name: true,
          last_name: true
        }
      }
    )
    res.status(200).json(user)
  } catch (error) {
    res.status(400).json({msg:error.message})
  }
}

// for user to set first name and last name
const setFnLname = async (req, res) => {
  const {first_name, last_name} = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: {
        first_name: first_name,
        last_name: last_name
      }
    });
    res.status(200).json(removePassword(user, ["password", "is_deleted", "is_active", "created_at"]));
  } catch (error) {
    res.status(400).json({msg: error.message})
  }
};


// for admin user to control all users
const getAllUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        first_name: true,
        last_name: true,
        is_active: true,
        role: true
      },
      where: {
        is_deleted: false,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getUser = async (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: parseInt(user_id),
      },
    });
    res.status(200).json(removePassword(user, ["password", "is_deleted", "is_active", "created_at"]));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const createUser = async (req, res) => {
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
    const userWithoutPassword = removePassword(user, ["password"]);
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

const editUser = async (req, res) => {
  const user_id = parseInt(req.params.id);
  const { first_name, last_name, role } = req.body;
  try {
    if (!first_name || !last_name || !role) {
      res.status(400);
      throw new Error("All field is required");
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        first_name: first_name,
        last_name: last_name,
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

const deleteUser = async (req, res) => {
  const user_id = parseInt(req.params.id);
  try {
    const deletedUser = await prisma.user.delete({
      where:{
        id: user_id
      }
    })
    res.status(204).json({'msg': deletedUser})
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }
};

module.exports = {
  getAllUser,
  getUser,
  editUser,
  deleteUser,
  createUser,
  setFnLname,
  getCurrentUser
};
