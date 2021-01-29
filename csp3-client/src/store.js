import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  userRegisterReducer,
  userLoginReducer,
  userGoogleLoginReducer,
  userChangePasswordReducer,
  userForgotPasswordReducer,
  userResetPasswordReducer
} from './reducers/userReducers'
import {
  categoryAddIncomeReducer,
  categoryAddExpensesReducer,
  categoryUpdateReducer,
  categoryDeleteReducer,
  categoryListReducer,
  categoryListTotalReducer,
  categoryIncomeListReducer,
  categoryExpensesListReducer
} from './reducers/categoryReducers'
import {
  transactionIncomeListReducer,
  transactionExpensesListReducer,
  transactionTrendListReducer,
  transactionRecordsReducer,
  transactionAddReducer,
  transactionUpdateReducer,
  transactionDeleteReducer
} from './reducers/transactionReducers'

const reducer = combineReducers({
  userRegister: userRegisterReducer,
  userLogin: userLoginReducer,
  userGoogleLogin: userGoogleLoginReducer,
  userChangePassword: userChangePasswordReducer,
  userForgotPassword: userForgotPasswordReducer,
  userResetPassword: userResetPasswordReducer,
  categoryList: categoryListReducer,
  categoryListTotal: categoryListTotalReducer,
  categoryIncomeList: categoryIncomeListReducer,
  categoryExpensesList: categoryExpensesListReducer,
  categoryAddIncome: categoryAddIncomeReducer,
  categoryAddExpenses: categoryAddExpensesReducer,
  categoryUpdate: categoryUpdateReducer,
  categoryDelete: categoryDeleteReducer,
  transactionIncomeList: transactionIncomeListReducer,
  transactionExpensesList: transactionExpensesListReducer,
  transactionTrendList: transactionTrendListReducer,
  transactionRecords: transactionRecordsReducer,
  transactionAdd: transactionAddReducer,
  transactionUpdate: transactionUpdateReducer,
  transactionDelete: transactionDeleteReducer
})

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const initialState = {
  userLogin: { userInfo: userInfoFromStorage }
}

const middleware = [thunk]

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store
