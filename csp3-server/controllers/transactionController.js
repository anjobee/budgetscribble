import asyncHandler from 'express-async-handler'
import Transaction from '../models/Transaction.js'
import mongoose from 'mongoose'

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
  const {
    categoryName,
    transactionName,
    transactionDesc,
    transactionAmount,
    date
  } = req.body

  const category = await Transaction.findOne({
    categoryName,
    userId: req.user.id
  })

  if (!category) {
    res.status(400)
    throw new Error(`No category found`)
  }

  const transaction = {
    transactionName,
    transactionDesc,
    transactionAmount,
    itemType: category.transactionType,
    timestamp: date,
    userId: req.user.id
  }

  category.transactionList.push(transaction)

  category.transactionCount += 1

  category.totalTransactionAmount += Number(transactionAmount)

  await category.save()
  res.status(201).json({ message: 'Transaction successfully added' })
})

// @desc    Get all transactions by type
// @route   GET /api/transactions/:type
// @access  Private
const getTransactionsByType = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({
    transactionType: req.params.type,
    userId: req.user.id
  }).select('categoryName totalTransactionAmount transactionList')

  if (!transactions) {
    res.status(400)
    throw new Error(`No category found`)
  }

  res.status(200).json(transactions)
})

// @desc    Get all transactions for history
// @route   GET /api/transactions/history.:type
// @access  Private
const getTransactionsForHistory = asyncHandler(async (req, res) => {
  const paramId = mongoose.Types.ObjectId(req.user.id)

  const filters = { userId: paramId, transactionType: req.params.type }

  const matchStage = { $match: filters }

  const unwindStage = { $unwind: '$transactionList' }

  const projectionStage = {
    $project: {
      _id: 1,
      categoryName: 1,
      totalTransactionAmount: 1,
      transactionList: 1
    }
  }

  const groupStage = {
    $group: {
      _id: '$_id',
      categoryName: { $first: '$categoryName' },
      totalTransactionAmount: { $first: '$totalTransactionAmount' },
      transactionList: { $push: '$transactionList' }
    }
  }

  const sortStage = {
    $sort: { 'transactionList.timestamp': -1 }
  }

  const queryPipeline = [
    matchStage,
    unwindStage,
    sortStage,
    projectionStage,
    groupStage
  ]

  let transactions = await Transaction.aggregate(queryPipeline)

  res.status(200).json(transactions)
})

// @desc    Update a transaction
// @route   PUT /api/transactions
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
  const {
    categoryId,
    transactionId,
    newName,
    newDescription,
    newAmount,
    newDate
  } = req.body

  const category = await Transaction.findById(categoryId)

  if (category) {
    const list = category.transactionList.find(
      (x) => x._id.toString() === transactionId
    )

    category.totalTransactionAmount -= Number(list.transactionAmount)

    list.transactionName = newName ? newName : list.transactionName
    list.transactionDesc = newDescription
      ? newDescription
      : list.transactionDesc
    list.transactionAmount = newAmount
    list.itemType = category.transactionType
    list.timestamp = newDate ? newDate : new Date()
    list.userId = req.user.id

    category.totalTransactionAmount += Number(newAmount)

    const updatedTransaction = await category.save()
    res.status(200).json(updatedTransaction)
  } else {
    res.status(400)
    throw new Error(`No category found`)
  }
})

// @desc    Delete a transaction by ID
// @route   DELETE /api/categories/:categoryId/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
  const category = await Transaction.findById(req.params.categoryId)

  if (!category) {
    res.status(400)
    throw new Error(`No category found`)
  }

  const transaction = category.transactionList.find(
    (t) => t.id === req.params.id
  )

  if (!transaction) {
    res.status(400)
    throw new Error(`No transaction found`)
  }

  category.transactionCount -= 1

  category.totalTransactionAmount -= Number(transaction.transactionAmount)

  await transaction.remove()

  await category.save()

  res.status(200).json({ message: 'Deleted transaction' })
})

// @desc    Get all user transactions by date
// @route   GET /api/transactions/total
// @access  Private
const getTransactionsByDate = asyncHandler(async (req, res) => {
  const paramId = mongoose.Types.ObjectId(req.user.id)

  const filtersIncome = { userId: paramId, transactionType: 'income' }
  const filtersExpenses = { userId: paramId, transactionType: 'expenses' }

  const matchStageIncome = { $match: filtersIncome }
  const matchStageExpenses = { $match: filtersExpenses }
  const unwindStage = { $unwind: '$transactionList' }

  const projectionStage = {
    $project: {
      _id: 0,
      year: { $year: '$transactionList.timestamp' },
      month: { $month: '$transactionList.timestamp' },
      transactionList: 1
    }
  }

  const groupStage = {
    $group: {
      _id: {
        year: '$year',
        month: '$month'
      },
      total: { $sum: '$transactionList.transactionAmount' }
    }
  }

  const sortStage = {
    $sort: { _id: 1 }
  }

  const queryPipelineIncome = [
    matchStageIncome,
    unwindStage,
    projectionStage,
    groupStage,
    sortStage
  ]

  const queryPipelineExpenses = [
    matchStageExpenses,
    unwindStage,
    projectionStage,
    groupStage,
    sortStage
  ]

  let income = await Transaction.aggregate(queryPipelineIncome)
  let expenses = await Transaction.aggregate(queryPipelineExpenses)

  res.status(200).json({
    incomeLength: income.length,
    expensesLength: expenses.length,
    income,
    expenses
  })
})

// @desc    Get all transaction records
// @route   GET /api/transactions
// @access  Private
const getTransactionRecords = asyncHandler(async (req, res) => {
  const paramId = mongoose.Types.ObjectId(req.user.id)

  const filters = { userId: paramId }

  const matchStage = { $match: filters }
  const unwindStage = { $unwind: '$transactionList' }

  const projectionStage = {
    $project: {
      _id: 1,
      categoryName: 1,
      month: { $month: '$transactionList.timestamp' },
      day: { $dayOfMonth: '$transactionList.timestamp' },
      year: { $year: '$transactionList.timestamp' },
      transactionList: 1
    }
  }

  const sortStage = {
    $sort: { month: -1, day: -1, year: -1 }
  }

  const queryPipeline = [matchStage, unwindStage, projectionStage, sortStage]

  let transactionRecords = await Transaction.aggregate(queryPipeline)

  res.status(200).json(transactionRecords)
})

export {
  addTransaction,
  getTransactionRecords,
  getTransactionsByType,
  getTransactionsForHistory,
  getTransactionsByDate,
  updateTransaction,
  deleteTransaction
}
