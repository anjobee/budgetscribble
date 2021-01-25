import axios from 'axios'
import {
  CATEGORY_LIST_INCOME_REQUEST,
  CATEGORY_LIST_INCOME_SUCCESS,
  CATEGORY_LIST_INCOME_FAIL,
  CATEGORY_ADD_INCOME_FAIL,
  CATEGORY_ADD_INCOME_REQUEST,
  CATEGORY_ADD_INCOME_SUCCESS,
  CATEGORY_DELETE_FAIL,
  CATEGORY_DELETE_REQUEST,
  CATEGORY_DELETE_SUCCESS,
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

export const getCategoryList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_LIST_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/categories`, config)

    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getTotalCategoryList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_LIST_TOTAL_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/categories/total`, config)

    dispatch({
      type: CATEGORY_LIST_TOTAL_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_TOTAL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getCategoryIncomeList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_LIST_INCOME_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/categories/income`, config)

    dispatch({
      type: CATEGORY_LIST_INCOME_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_INCOME_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const addCategoryIncome = (categoryName, categoryDesc) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CATEGORY_ADD_INCOME_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.post(
      `/api/categories`,
      { transactionType: 'income', categoryName, categoryDesc },
      config
    )

    dispatch({
      type: CATEGORY_ADD_INCOME_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_ADD_INCOME_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getCategoryExpensesList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_LIST_EXPENSES_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/categories/expenses`, config)

    dispatch({
      type: CATEGORY_LIST_EXPENSES_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_EXPENSES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const addCategoryExpenses = (categoryName, categoryDesc) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CATEGORY_ADD_EXPENSES_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.post(
      `/api/categories`,
      { transactionType: 'expenses', categoryName, categoryDesc },
      config
    )

    dispatch({
      type: CATEGORY_ADD_EXPENSES_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_ADD_EXPENSES_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const updateCategory = (categoryId, newName, newDesc) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: CATEGORY_UPDATE_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    await axios.put(
      `/api/categories`,
      {
        categoryId,
        newName,
        newDesc
      },
      config
    )

    dispatch({
      type: CATEGORY_UPDATE_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const deleteCategory = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_DELETE_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    await axios.delete(`/api/categories/${id}`, config)

    dispatch({
      type: CATEGORY_DELETE_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}
