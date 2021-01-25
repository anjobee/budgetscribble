import express from 'express'
const router = express.Router()
import {
  authUser,
  authGoogleUser,
  registerUser,
  changePassword
} from '../controllers/userControllers.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser)
router.post('/login', authUser)
router.put('/changepassword', protect, changePassword)
router.post('/verify-google-id-token', authGoogleUser)

export default router
