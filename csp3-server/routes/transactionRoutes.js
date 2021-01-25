import express from 'express'
const router = express.Router({ mergeParams: true })
import {
  addTransaction,
  getTransactionRecords,
  getTransactionsByType,
  // getTransactionsForHistory,
  getTransactionsByDate,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js'
import { protect } from '../middleware/authMiddleware.js'

router
  .route('/')
  .post(protect, addTransaction)
  .get(protect, getTransactionRecords)
  .put(protect, updateTransaction)

router.route('/:id').delete(protect, deleteTransaction)

// router.route('/history/:type').get(protect, getTransactionsForHistory)

router.get('/total', protect, getTransactionsByDate)

router.get('/:type', protect, getTransactionsByType)

export default router
