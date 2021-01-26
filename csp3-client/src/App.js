import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ChangePasswordScreen from './screens/ChangePasswordScreen'
import IncomeCategoryScreen from './screens/IncomeCategoryScreen'
import ExpensesCategoryScreen from './screens/ExpensesCategoryScreen'
import IncomeTransactionScreen from './screens/IncomeTransactionScreen'
import ExpensesTransactionScreen from './screens/ExpensesTransactionScreen'
import LoadingOverlay from 'react-loading-overlay'

function App() {
  const userLogin = useSelector((state) => state.userLogin)
  const { loading } = userLogin

  const userRegister = useSelector((state) => state.userRegister)
  const { loading: loadingRegister } = userRegister

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin)
  const { loading: googleLoading } = userGoogleLogin

  const userChangePassword = useSelector((state) => state.userChangePassword)
  const { loading: loadingChangePassword } = userChangePassword

  const isLoading =
    loading || googleLoading || loadingChangePassword || loadingRegister

  return (
    <Router>
      <LoadingOverlay active={isLoading} spinner text='Loading...'>
        <Container className='py-4 app-container' fluid>
          <Header />

          <Route path='/' component={LoginScreen} exact />
          <Route path='/dashboard' component={HomeScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/changepassword' component={ChangePasswordScreen} />
          <Route
            path='/categories/income'
            component={IncomeCategoryScreen}
            exact
          />
          <Route
            path='/categories/expenses'
            component={ExpensesCategoryScreen}
            exact
          />
          <Route
            path='/transactions/income'
            component={IncomeTransactionScreen}
            exact
          />
          <Route
            path='/transactions/expenses'
            component={ExpensesTransactionScreen}
            exact
          />
        </Container>
        <Footer />
      </LoadingOverlay>
    </Router>
  )
}

export default App
