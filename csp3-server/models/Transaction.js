import mongoose from 'mongoose'

const transactionListSchema = mongoose.Schema({
  transactionName: { type: String, require: true },
  transactionDesc: { type: String },
  transactionAmount: { type: Number, required: true },
  itemType: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
})

const transactionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    transactionType: {
      type: String,
      required: true
    },
    categoryName: {
      type: String,
      required: true
    },
    categoryDesc: {
      type: String
    },
    transactionList: [transactionListSchema],
    transactionCount: {
      type: Number,
      required: true,
      default: 0
    },
    totalTransactionAmount: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
