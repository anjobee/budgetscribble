import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { sendEmail } from '../utils/sendEmail.js'
import crypto from 'crypto'

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

  if (user) {
    if (user.matchPassword(oldPassword)) {
      user.password = newPassword
    } else {
      res.status(400)
      throw new Error('Old password incorrect')
    }

    user.save()

    res.status(200).json({ message: 'Password successfully changed' })
  } else {
    res.status(401)
    throw new Error('Unauthorized')
  }
})

//@desc     Forgot password
//@route    POST /api/users/forgotpassword
//@access   Public
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new Error('There is no user with that email.', 404))
  }

  if (user.loginType === 'google') {
    throw new Error('Login type is google, please use google login.')
  }

  //Make a reset token
  const resetToken = user.getResetPasswordToken()

  const expiration = new Date(resetToken.resetPasswordExpires)

  await user.save({ validateBeforeSave: false })

  const resetUrl = `https://${req.get('host')}/resetpassword`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password that will expire in 30 minutes. 
  <br/><br/> Please make a reset password request to: ${resetUrl} 
  <br/><br/><strong style="font-size: 15px;">Reset Token: ${resetToken.resetToken}</strong> 
  <br/><br/>Expires In: ${expiration}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token.',
      message
    })

    res.status(200).json('Email sent.')
  } catch (err) {
    console.error(err)
    user.getResetPasswordToken = undefined
    user.getResetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    throw new Error('Email could not be sent', 500)
  }
})

//@desc     Reset password
//@route    PUT /api/users/resetpassword/
//@access   Public
const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken, newPassword } = req.body

  //Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  })

  if (!user) {
    throw new Error('Please enter valid token.', 400)
  }

  //Set new password
  user.password = newPassword
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  res.status(200).json('Password has been updated.')
})

export {
  authGoogleUser,
  authUser,
  registerUser,
  changePassword,
  forgotPassword,
  resetPassword
}
