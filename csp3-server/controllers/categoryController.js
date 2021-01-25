import asyncHandler from 'express-async-handler'
import Transaction from '../models/Transaction.js'
import mongoose from 'mongoose'

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const addCategory = asyncHandler(async (req, res) => {
  const { transactionType, categoryName, categoryDesc } = req.body

  const categoryExists = await Transaction.findOne({
    categoryName,
    userId: req.user.id
  })

  if (categoryExists) {
    res.status(400)
    throw new Error(`Category named ${categoryName} has already been created`)
  }

  const category = new Transaction({
    userId: req.user._id,
    transactionType,
    categoryName,
    categoryDesc
  })
  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Transaction.find({ userId: req.user.id })

  if (!categories) {
    res.status(400)
    throw new Error(`No categories found`)
  }

  //TOTAL CASH AMOUNT
  let total = 0
  categories.forEach((x) =>
    x.transactionType === 'income'
      ? (total += x.totalTransactionAmount)
      : (total -= x.totalTransactionAmount)
  )

  res.status(200).json({ categories, total })
})

// @desc    Get categories by type
// @route   GET /api/categories/:type
// @access  Private
const getCategoriesByType = asyncHandler(async (req, res) => {
  const category = await Transaction.find({
    transactionType: req.params.type,
    userId: req.user.id
  })

  if (!category) {
    res.status(400)
    throw new Error(`No categories found`)
  }

  res.status(200).json(category)
})

// @desc    Update a category
// @route   PUT /api/categories
// @access  Private
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId, newName, newDesc } = req.body

  const category = await Transaction.findById(categoryId)

  if (category) {
    category.categoryName = newName
    category.categoryDesc = newDesc

    const updatedCategory = await category.save()
    res.status(200).json(updatedCategory)
  } else {
    res.status(400)
    throw new Error(`No category found`)
  }
})

// @desc    Delete a category by ID
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Transaction.findById(req.params.id)

  if (!category) {
    res.status(400)
    throw new Error(`No category found`)
  }

  await category.remove()

  res.json({ message: 'Deleted category' })
})

// @desc    Get total budget for all categories by date
// @route   GET /api/categories/total
// @access  Private
const getTotalCategoryBudgetByDate = asyncHandler(async (req, res) => {
  const paramId = mongoose.Types.ObjectId(req.user.id)

  const filters = { userId: paramId }

  const matchStage = { $match: filters }
  const projectionStage = {
    $project: {
      _id: 1,
      categoryName: 1,
      transactionType: 1,
      totalTransactionAmount: 1,
      year: { $year: '$updatedAt' },
      month: { $month: '$updatedAt' }
    }
  }

  const queryPipeline = [matchStage, projectionStage]

  let docs = await Transaction.aggregate(queryPipeline)

  res.status(200).json({ length: docs.length, result: docs })
})

export {
  addCategory,
  getCategories,
  getCategoriesByType,
  updateCategory,
  deleteCategory,
  getTotalCategoryBudgetByDate
}
