import React from 'react'
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

function App() {
  return (
    <Router>
      <Header />
      <Container fluid>
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
    </Router>
  )
}

export default App
