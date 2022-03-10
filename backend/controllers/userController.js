const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


// @desc    Register New User
// @route   POST /api/users
// @access  Public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide all field for register')
  }

  const userExist = await User.findOne({ email })

  if (userExist) {
    res.status(400)
    throw new Error("User already exist")
  }

  const salt = await bcrypt.genSalt(10)

  const hassedPass = await bcrypt.hash(password, salt)

  const user = await User.create({
    name, email, password: hassedPass
  })
  if (user) {
    res.status(201)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid authentication')
  }

})

// @desc    Login User
// @route   POST /api/users/login
// @access  Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (!user) {
    res.status(400)
    throw new Error(`User '${email}' not associate with any account`)
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }

})

// @desc    Get user data
// @route   POST /api/users/me
// @access  Private

const getMe = asyncHandler(async (req, res) => {
  res.json({
    message: 'get me'
  })
})


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  })
}

module.exports = {
  registerUser, loginUser, getMe
}