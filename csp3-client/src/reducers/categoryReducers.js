import {
  CATEGORY_LIST_INCOME_REQUEST,
  CATEGORY_LIST_INCOME_SUCCESS,
  CATEGORY_LIST_INCOME_FAIL,
  CATEGORY_ADD_INCOME_REQUEST,
  CATEGORY_ADD_INCOME_SUCCESS,
  CATEGORY_ADD_INCOME_FAIL,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_EXPENSES_REQUEST,
  CATEGORY_LIST_EXPENSES_SUCCESS,
  CATEGORY_LIST_EXPENSES_FAIL,
  CATEGORY_ADD_EXPENSES_REQUEST,
  CATEGORY_ADD_EXPENSES_SUCCESS,
  CATEGORY_ADD_EXPENSES_FAIL,
  CATEGORY_LIST_TOTAL_REQUEST,
  CATEGORY_LIST_TOTAL_SUCCESS,
  CATEGORY_LIST_TOTAL_FAIL,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAIL
} from '../constants/categoryConstants'

export const categoryListReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { loading: true }
    case CATEGORY_LIST_SUCCESS:
      return {
        loading: false,
        categories: action.payload.categories,
        total: action.payload.total.toLocaleString()
      }
    case CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryListTotalReducer = (
  state = { categories: [] },
  action
) => {
  switch (action.type) {
    case CATEGORY_LIST_TOTAL_REQUEST:
      return { loading: true }
    case CATEGORY_LIST_TOTAL_SUCCESS:
      return {
        loading: false,
        categories: action.payload.result
      }
    case CATEGORY_LIST_TOTAL_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryIncomeListReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_INCOME_REQUEST:
      return { loading: true }
    case CATEGORY_LIST_INCOME_SUCCESS:
      return { loading: false, list: action.payload }
    case CATEGORY_LIST_INCOME_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryAddIncomeReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_ADD_INCOME_REQUEST:
      return { loading: true }
    case CATEGORY_ADD_INCOME_SUCCESS:
      return { loading: false, success: true, category: action.payload }
    case CATEGORY_ADD_INCOME_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryExpensesListReducer = (state = { list: [] }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_EXPENSES_REQUEST:
      return { loading: true }
    case CATEGORY_LIST_EXPENSES_SUCCESS:
      return { loading: false, list: action.payload }
    case CATEGORY_LIST_EXPENSES_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryAddExpensesReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_ADD_EXPENSES_REQUEST:
      return { loading: true }
    case CATEGORY_ADD_EXPENSES_SUCCESS:
      return { loading: false, success: true, category: action.payload }
    case CATEGORY_ADD_EXPENSES_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_UPDATE_REQUEST:
      return { loading: true }
    case CATEGORY_UPDATE_SUCCESS:
      return { loading: false, success: true }
    case CATEGORY_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_DELETE_REQUEST:
      return { loading: true }
    case CATEGORY_DELETE_SUCCESS:
      return { loading: false, success: true }
    case CATEGORY_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
