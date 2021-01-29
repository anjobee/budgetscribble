import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    loginType: {
      type: String,
      required: true,
      default: 'email'
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//Generate and hash password token
userSchema.methods.getResetPasswordToken = function () {
  //Generate token
  const resetToken = crypto.randomBytes(20).toString('hex')

  //Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  //Set expire
  const dateNow = new Date()
  // this.resetPasswordExpire = Date.now() + 10 * 60 * 1000
  const resetPasswordExpires = (this.resetPasswordExpire = dateNow.setMinutes(
    dateNow.getMinutes() + 30
  ))

  return { resetToken, resetPasswordExpires }
}

const User = mongoose.model('User', userSchema)

export default User
