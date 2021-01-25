import express from 'express'
const router = express.Router()
import {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoriesByType,
  getTotalCategoryBudgetByDate
} from '../controllers/categoryController.js'
import { protect } from '../middleware/authMiddleware.js'

import transactionRoutes from './transactionRoutes.js'

router.use('/:categoryId/transactions', transactionRoutes)

router
  .route('/')
  .get(protect, getCategories)
  .post(protect, addCategory)
  .put(protect, updateCategory)
router.route('/:id').delete(protect, deleteCategory)
router.get('/total', protect, getTotalCategoryBudgetByDate)
router.get('/:type', protect, getCategoriesByType)

export default router
