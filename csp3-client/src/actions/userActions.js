import axios from 'axios'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_CHANGE_PASSWORD_REQUEST,
  USER_CHANGE_PASSWORD_SUCCESS,
  USER_CHANGE_PASSWORD_FAIL,
  USER_GOOGLE_LOGIN_REQUEST,
  USER_GOOGLE_LOGIN_SUCCESS,
  USER_GOOGLE_LOGIN_FAIL
} from '../constants/userConstants'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: USER_LOGIN_REQUEST
    })

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post(
      `/api/users/login`,
      { email, password },
      config
    )

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const googleLogin = (tokenId) => async (dispatch) => {
  try {
    dispatch({
      type: USER_GOOGLE_LOGIN_REQUEST
    })
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const { data } = await axios.post(
      `/api/users/verify-google-id-token`,
      { tokenId },
      config
    )

    dispatch({
      type: USER_GOOGLE_LOGIN_SUCCESS,
      payload: data
    })

    dispatch({
      type: USER_LOGIN_SUCCESS,
      payload: data
    })

    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({
      type: USER_GOOGLE_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
  document.location.href = '/'
}

export const register = (formData) => async (dispatch) => {
  try {
    dispatch({
      type: USER_REGISTER_REQUEST
    })

    const { firstName, lastName, email, password } = formData

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const { data } = await axios.post(
      `/api/users`,
      { firstName, lastName, email, password },
      config
    )

    dispatch({
      type: USER_REGISTER_SUCCESS,
      payload: data
    })
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}

export const changePassword = (oldPassword, newPassword) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: USER_CHANGE_PASSWORD_REQUEST
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
      `/api/users/changepassword`,
      { oldPassword, newPassword },
      config
    )

    dispatch({
      type: USER_CHANGE_PASSWORD_SUCCESS
    })
  } catch (error) {
    dispatch({
      type: USER_CHANGE_PASSWORD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
    })
  }
}
