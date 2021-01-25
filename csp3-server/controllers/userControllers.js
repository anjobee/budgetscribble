import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'

// @desc    Auth google user and login
// @route   POST /api/users/verify-google-id-token
// @access  Public
const authGoogleUser = asyncHandler(async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const tokenId = req.body

  const data = await client.verifyIdToken({
    idToken: tokenId.tokenId,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  if (data.payload.email_verified === true) {
    const user = await User.findOne({ email: data.payload.email }).exec()

    if (user && user.loginType === 'google') {
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        loginType: user.loginType,
        token: generateToken(user._id)
      })
    } else {
      const googleUser = await User.create({
        firstName: data.payload.given_name,
        lastName: data.payload.family_name,
        email: data.payload.email,
        loginType: 'google'
      })

      if (googleUser) {
        res.status(201).json({
          _id: googleUser._id,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          loginType: googleUser.loginType,
          token: generateToken(googleUser._id)
        })
      }
    }
  } else {
    res.status(401)
    throw new Error('Google authentication failed')
  }
})

// @desc    Auth user and login
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      loginType: user.loginType,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, loginType, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    loginType,
    password
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Change password of the current user
// @route   PUT /api/users/changepassword
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body

  const user = await User.findById(req.user.id)

  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword

    user.save()

    res.status(200)
  } else {
    res.status(401)
    throw new Error('Old password incorrect')
  }
})

export { authGoogleUser, authUser, registerUser, changePassword }
