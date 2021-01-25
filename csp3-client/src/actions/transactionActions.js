import axios from 'axios'
import {
  TRANSACTION_ADD_FAIL,
  TRANSACTION_ADD_REQUEST,
  TRANSACTION_ADD_SUCCESS,
  TRANSACTION_INCOME_LIST_FAIL,
  TRANSACTION_INCOME_LIST_REQUEST,
  TRANSACTION_INCOME_LIST_SUCCESS,
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

export const getTransactionIncomeList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRANSACTION_INCOME_LIST_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/transactions/income`, config)

    dispatch({
      type: TRANSACTION_INCOME_LIST_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_INCOME_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getTransactionExpensesList = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRANSACTION_EXPENSES_LIST_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/transactions/expenses`, config)

    dispatch({
      type: TRANSACTION_EXPENSES_LIST_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_EXPENSES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getTransactionTrend = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRANSACTION_TREND_LIST_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/transactions/total`, config)

    dispatch({
      type: TRANSACTION_TREND_LIST_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_TREND_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const getTransactionRecords = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRANSACTION_RECORDS_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    const { data } = await axios.get(`/api/transactions`, config)

    dispatch({
      type: TRANSACTION_RECORDS_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_RECORDS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const addTransaction = (
  categoryName,
  transactionName,
  transactionDesc,
  transactionAmount,
  date
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRANSACTION_ADD_REQUEST
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
      `/api/transactions`,
      {
        categoryName,
        transactionName,
        transactionDesc,
        transactionAmount,
        date
      },
      config
    )

    dispatch({
      type: TRANSACTION_ADD_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const updateTransaction = (
  categoryId,
  transactionId,
  newName,
  newDescription,
  newAmount,
  newDate
) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TRANSACTION_UPDATE_REQUEST
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
      `/api/transactions`,
      {
        categoryId,
        transactionId,
        newName,
        newDescription,
        newAmount,
        newDate
      },
      config
    )

    dispatch({
      type: TRANSACTION_UPDATE_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const deleteTransaction = (categoryId, transactionId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: TRANSACTION_DELETE_REQUEST
    })

    const {
      userLogin: { userInfo }
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }

    await axios.delete(
      `/api/categories/${categoryId}/transactions/${transactionId}`,
      config
    )

    dispatch({
      type: TRANSACTION_DELETE_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}
