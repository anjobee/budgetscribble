import {
  TRANSACTION_INCOME_LIST_REQUEST,
  TRANSACTION_INCOME_LIST_SUCCESS,
  TRANSACTION_INCOME_LIST_FAIL,
  TRANSACTION_ADD_REQUEST,
  TRANSACTION_ADD_SUCCESS,
  TRANSACTION_ADD_FAIL,
  TRANSACTION_DELETE_REQUEST,
  TRANSACTION_DELETE_SUCCESS,
  TRANSACTION_DELETE_FAIL,
  TRANSACTION_EXPENSES_LIST_REQUEST,
  TRANSACTION_EXPENSES_LIST_SUCCESS,
  TRANSACTION_EXPENSES_LIST_FAIL,
  TRANSACTION_TREND_LIST_REQUEST,
  TRANSACTION_TREND_LIST_SUCCESS,
  TRANSACTION_TREND_LIST_FAIL,
  TRANSACTION_RECORDS_REQUEST,
  TRANSACTION_RECORDS_SUCCESS,
  TRANSACTION_RECORDS_FAIL,
  TRANSACTION_UPDATE_REQUEST,
  TRANSACTION_UPDATE_SUCCESS,
  TRANSACTION_UPDATE_FAIL
} from '../constants/transactionConstants'

export const transactionIncomeListReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case TRANSACTION_INCOME_LIST_REQUEST:
      return { loading: true }
    case TRANSACTION_INCOME_LIST_SUCCESS:
      return { loading: false, list: action.payload }
    case TRANSACTION_INCOME_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const transactionExpensesListReducer = (
  state = { list: [] },
  action
) => {
  switch (action.type) {
    case TRANSACTION_EXPENSES_LIST_REQUEST:
      return { loading: true }
    case TRANSACTION_EXPENSES_LIST_SUCCESS:
      return { loading: false, list: action.payload }
    case TRANSACTION_EXPENSES_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const transactionTrendListReducer = (
  state = { incomeTrend: [], expensesTrend: [] },
  action
) => {
  switch (action.type) {
    case TRANSACTION_TREND_LIST_REQUEST:
      return { loading: true }
    case TRANSACTION_TREND_LIST_SUCCESS:
      return {
        loading: false,
        incomeTrend: action.payload.income,
        expensesTrend: action.payload.expenses
      }
    case TRANSACTION_TREND_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const transactionRecordsReducer = (
  state = { transactions: [] },
  action
) => {
  switch (action.type) {
    case TRANSACTION_RECORDS_REQUEST:
      return { loading: true }
    case TRANSACTION_RECORDS_SUCCESS:
      return {
        loading: false,
        transactions: action.payload
      }
    case TRANSACTION_RECORDS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const transactionAddReducer = (state = {}, action) => {
  switch (action.type) {
    case TRANSACTION_ADD_REQUEST:
      return { loading: true }
    case TRANSACTION_ADD_SUCCESS:
      return { loading: false, success: true, transaction: action.payload }
    case TRANSACTION_ADD_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const transactionUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case TRANSACTION_UPDATE_REQUEST:
      return { loading: true }
    case TRANSACTION_UPDATE_SUCCESS:
      return { loading: false, success: true }
    case TRANSACTION_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const transactionDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case TRANSACTION_DELETE_REQUEST:
      return { loading: true }
    case TRANSACTION_DELETE_SUCCESS:
      return { loading: false, success: true }
    case TRANSACTION_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
