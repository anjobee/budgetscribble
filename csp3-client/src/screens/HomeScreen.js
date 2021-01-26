import React, { useState, useEffect, useMemo } from 'react'
import DatePicker from 'react-datepicker'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Table, Form, Row, Col, Button, Card } from 'react-bootstrap'
import TransactionRecords from '../components/TransactionRecords'
import Paginate from '../components/Paginate'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import {
  getCategoryList,
  getTotalCategoryList,
  deleteCategory
} from '../actions/categoryActions'
import {
  getTransactionRecords,
  getTransactionTrend,
  addTransaction
} from '../actions/transactionActions'
import CategoryListPie from '../components/CategoryListPie'
import PieChart from '../components/PieChart'
import LineChart from '../components/LineChart'

const HomeScreen = ({ history }) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!userInfo) {
    history.push('/login')
  }

  //STATES FOR ADD TRANSACTION CARD
  const [categoryName, setCategoryName] = useState('')
  const [transactionName, setTransactionName] = useState('')
  const [transactionDescription, setTransactionDescription] = useState('')
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [date, setDate] = useState(new Date())

  // TRANSACTIONS QUERY SECTION-------------------------------------------
  const categoryList = useSelector((state) => state.categoryList)
  const {
    loading,
    categories,
    success: successCategoryList,
    total,
    error
  } = categoryList

  const categoryListTotal = useSelector((state) => state.categoryListTotal)
  const {
    loading: loadingTotal,
    categories: categoriesTotal,
    error: errorTotal
  } = categoryListTotal

  const transactionTrendList = useSelector(
    (state) => state.transactionTrendList
  )
  const {
    loading: loadingTransactionTrend,
    incomeTrend,
    expensesTrend,
    error: errorTransactionTrend
  } = transactionTrendList

  // TRANSACTIONS RECORD/HISTORY-------------------------------------------
  const transactionRecords = useSelector((state) => state.transactionRecords)
  const {
    loading: loadingTransactionRecords,
    transactions,
    success: successTransactionRecords,
    error: errorTransactionRecords
  } = transactionRecords

  const [filter, setFilter] = useState('')

  //TABLE PAGINATION
  const [totalItems, setTotalItems] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerRecord = 13

  const [totalItemsCategory, setTotalItemsCategory] = useState(0)
  const [currentPageCategory, setCurrentPageCategory] = useState(1)
  const itemsPerCategory = 5

  //TABLE FILTER
  const filterQuery = (filter) => {
    return (
      transactions &&
      transactions.filter(
        (x) =>
          x.categoryName.toUpperCase().indexOf(filter.toUpperCase()) > -1 ||
          x.transactionList.transactionName
            .toUpperCase()
            .indexOf(filter.toUpperCase()) > -1 ||
          x.transactionList.itemType
            .toUpperCase()
            .indexOf(filter.toUpperCase()) > -1 ||
          x.transactionList.timestamp
            .slice(0, 10)
            .indexOf(filter.toUpperCase()) > -1 ||
          JSON.stringify(x.transactionList.transactionAmount).indexOf(filter) >
            -1
      )
    )
  }

  const recordData = useMemo(() => {
    if (loadingTotal) return
    let computedRecords = filterQuery(filter)

    setTotalItems(computedRecords.length)

    return computedRecords.slice(
      (currentPage - 1) * itemsPerRecord,
      (currentPage - 1) * itemsPerRecord + itemsPerRecord
    )
  }, [filter, currentPage, successTransactionRecords])

  const categoryData = useMemo(() => {
    if (loading) return
    let computedRecords = categories

    setTotalItemsCategory(computedRecords.length)

    return computedRecords.slice(
      (currentPageCategory - 1) * itemsPerCategory,
      (currentPageCategory - 1) * itemsPerCategory + itemsPerCategory
    )
  }, [currentPageCategory, successCategoryList])

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  //CATEGORY/TRANSASCTIONS ADD/UPDATE/DELETE-------------------------------------------

  const categoryDelete = useSelector((state) => state.categoryDelete)
  const { success: successCategoryDelete } = categoryDelete

  const transactionAdd = useSelector((state) => state.transactionAdd)
  const { success: successAdd } = transactionAdd

  const transactionUpdate = useSelector((state) => state.transactionUpdate)
  const { success } = transactionUpdate

  const transactionDelete = useSelector((state) => state.transactionDelete)
  const { success: successDelete } = transactionDelete

  //REDUX - QUERY DATA UPON RELOAD-------------------------------------------
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCategoryList())
    dispatch(getTotalCategoryList())
    dispatch(getTransactionTrend())
    dispatch(getTransactionRecords())
  }, [success, successAdd, successDelete, successCategoryDelete, dispatch])

  //SUBMIT HANDLERS EDIT/ADD/DELETE-------------------------------------------

  const submitTransactionHandler = () => {
    dispatch(
      addTransaction(
        categoryName,
        transactionName,
        transactionDescription,
        transactionAmount,
        date
      )
    )
    setTransactionName('')
    setTransactionDescription('')
    setTransactionAmount(0)
  }

  const deleteHandler = (categoryId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCategory(categoryId))
    }
  }

  //CHART DATA INITIALIZATION-------------------------------------------

  //CATEGORY PIE DATA
  let categoryPieData
  let categoryPieNames

  if (!loadingTotal) {
    categoryPieData = categoriesTotal.map(
      (category) => category.totalTransactionAmount
    )
    categoryPieNames = categoriesTotal.map((category) => category.categoryName)
  }

  //INCOME % VS EXPENSES % PIE CHART-------------------------------------------
  let totalIncome = 0
  let totalExpenses = 0

  if (!loadingTotal) {
    const income = categoriesTotal.filter((x) => x.transactionType === 'income')
    const expenses = categoriesTotal.filter(
      (x) => x.transactionType === 'expenses'
    )

    income.forEach((x) => (totalIncome += x.totalTransactionAmount))
    expenses.forEach((x) => (totalExpenses += x.totalTransactionAmount))
  }

  //LINE CHART RANGE
  const [startRange, setStartRange] = useState(1)
  const [endRange, setEndRange] = useState(12)

  return (
    <>
      <Meta title='BudgetScribble' />
      <Row className='justify-content-md-center'>
        <Col md={8}>
          {' '}
          <div className='jumbotron bg-jumbotron top-margin justify-con'>
            <h1 className='display-3'>Hello, {userInfo.firstName}!</h1>
            <p className='lead ml-3'>
              <i className='fas fa-money-bill'></i>&#8369;{total}
            </p>
            <hr className='my-4' />
            <p>
              Welcome to budget-tracker-app! Record your daily transactions with
              ease!
            </p>
            <p className='lead'>
              <Link
                className='btn btn-primary btn-lg'
                to='/categories/income'
                role='button'
              >
                Start Now!
              </Link>
            </p>
          </div>
        </Col>
      </Row>
      <Container className='jumbotron' fluid>
        <h1 className='text-center display-4 mb-5'>TRANSACTIONS</h1>
        <Row>
          <Col sm={12} lg={6}>
            {' '}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message>{error}</Message>
            ) : (
              <>
                <Card className='mb-5'>
                  <Card.Header className='transaction-card'>
                    ADD TRANSACTION
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <Form.Row>
                        <Form.Group as={Col} className='mt-1'>
                          <Form.Label
                            className='my-1 mr-2'
                            htmlFor='selectCategory'
                          >
                            Category
                          </Form.Label>
                          <Form.Control
                            as='select'
                            className='my-1 mr-sm-2'
                            id='selectCategory'
                            custom
                            onChange={(e) => setCategoryName(e.target.value)}
                          >
                            <option>Choose...</option>
                            {categories &&
                              categories.map((category, index) => (
                                <option
                                  className={
                                    category.transactionType === 'income'
                                      ? 'text-success'
                                      : 'text-danger'
                                  }
                                  key={index + 100}
                                  value={category.categoryName}
                                >
                                  {category.categoryName}
                                </option>
                              ))}
                          </Form.Control>
                        </Form.Group>

                        <Form.Group
                          controlId='transactionName'
                          as={Col}
                          sm={7}
                          className='mt-2'
                        >
                          <Form.Label>Transaction Name</Form.Label>
                          <Form.Control
                            type='text'
                            placeholder='Enter transaction name'
                            value={transactionName}
                            onChange={(e) => setTransactionName(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                      </Form.Row>

                      <Form.Group controlId='transactionDescription'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder='Enter transaction description'
                          value={transactionDescription}
                          onChange={(e) =>
                            setTransactionDescription(e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>

                      <Form.Row>
                        {' '}
                        <Form.Group
                          controlId='transactionAmount'
                          as={Col}
                          sm={5}
                        >
                          <Form.Label>Amount</Form.Label>
                          <Form.Control
                            type='number'
                            placeholder='Enter amount'
                            value={transactionAmount}
                            onChange={(e) =>
                              setTransactionAmount(e.target.value)
                            }
                          ></Form.Control>
                        </Form.Group>
                        <Form.Group className='ml-5'>
                          <Form.Label>Select Date</Form.Label>
                          <br />
                          <DatePicker
                            selected={date}
                            onChange={(d) =>
                              setDate(
                                new Date(
                                  d.getTime() - d.getTimezoneOffset() * 60000
                                )
                              )
                            }
                          />
                        </Form.Group>
                      </Form.Row>

                      <Button
                        variant='primary'
                        onClick={submitTransactionHandler}
                      >
                        Add
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
                <Card className='my-5'>
                  <Card.Header className='transaction-card'>
                    CATEGORY LIST
                  </Card.Header>
                  <Card.Body>
                    <Paginate
                      total={totalItemsCategory}
                      itemsPerPage={itemsPerCategory}
                      currentPage={currentPageCategory}
                      onPageChange={(page) => setCurrentPageCategory(page)}
                    />
                    <Table striped hover responsive>
                      <thead>
                        <tr className='table-dark'>
                          <th scope='col'>#</th>
                          <th scope='col'>CATEGORY NAME</th>
                          <th scope='col'>TYPE</th>
                          <th scope='col' className='text-center'>
                            ENTRIES
                          </th>
                          <th scope='col'>TOTAL AMOUNT</th>
                          <th scope='col'>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryData &&
                          categoryData.map((category, index) => (
                            <tr
                              key={index + 1}
                              className={
                                category.transactionType === 'income'
                                  ? 'table-success'
                                  : 'table-danger'
                              }
                            >
                              <th scope='row'>{index + 1}</th>
                              <td>{category.categoryName}</td>
                              <td>{category.transactionType.toUpperCase()}</td>
                              <td className='text-center'>
                                {category.transactionCount}
                              </td>
                              <td>
                                {category.transactionType === 'expenses'
                                  ? `-₱${category.totalTransactionAmount.toLocaleString()}`
                                  : `₱${category.totalTransactionAmount.toLocaleString()}`}
                              </td>
                              <td>
                                <Button
                                  variant='danger'
                                  className='btn-sm'
                                  onClick={() => deleteHandler(category._id)}
                                  key={`button-${index + 1}`}
                                >
                                  <i className='fas fa-trash'></i>
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
          <Col sm={12} lg={6}>
            {' '}
            {loadingTransactionRecords ? (
              <Loader />
            ) : errorTransactionRecords ? (
              <Message>{errorTransactionRecords}</Message>
            ) : (
              <>
                <Card>
                  <Card.Header className='transaction-card'>
                    TRANSACTION HISTORY
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col className='d-flex flex-row'>
                        {' '}
                        <Form.Group>
                          {' '}
                          <Form.Control
                            type='text'
                            sm={5}
                            placeholder='Enter keyword'
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                      <Col className='d-flex flex-row-reverse'>
                        {' '}
                        <Paginate
                          total={totalItems}
                          itemsPerPage={itemsPerRecord}
                          currentPage={currentPage}
                          onPageChange={(page) => setCurrentPage(page)}
                        />
                      </Col>
                    </Row>
                    <TransactionRecords data={recordData} />
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>

      <Container className='jumbotron' fluid>
        <h1 className='text-center display-4'>ANALYTICS</h1>
        <Row>
          <Col sm={12} md={6} lg={4}>
            {loadingTotal ? (
              <Loader />
            ) : errorTotal ? (
              <Message>{errorTotal}</Message>
            ) : (
              <Card className='my-5'>
                <Card.Header className='analytics-card'>
                  INCOME % VS EXPENSES %
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {' '}
                    <p className='text-info'>
                      TOTAL INCOME: &#8369;{totalIncome.toLocaleString()}{' '}
                    </p>
                    <p className='text-danger'>
                      TOTAL EXPENSES: &#8369;{totalExpenses.toLocaleString()}
                    </p>
                  </Card.Title>
                  <PieChart
                    totalIncome={totalIncome}
                    totalExpenses={totalExpenses}
                  />
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col sm={12} md={6} lg={4}>
            {loadingTotal ? (
              <Loader />
            ) : errorTotal ? (
              <Message>{errorTotal}</Message>
            ) : (
              <Card className='my-5'>
                <Card.Header className='analytics-card'>CATEGORIES</Card.Header>
                <Card.Body>
                  <CategoryListPie
                    categoryPieData={categoryPieData}
                    categoryPieNames={categoryPieNames}
                  />
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col sm={12} md={12} lg={4}>
            {loadingTransactionTrend ? (
              <Loader />
            ) : errorTransactionTrend ? (
              <Message>{errorTransactionTrend}</Message>
            ) : (
              <>
                <Card className='my-5'>
                  <Card.Header className='analytics-card'>
                    BUDGET TREND
                  </Card.Header>{' '}
                  <Card.Body>
                    <Card.Title>
                      <Form.Group as={Col} sm={5}>
                        <Form.Label>START RANGE</Form.Label>
                        <Form.Control
                          size='sm'
                          as='select'
                          id='selectFirstDate'
                          custom
                          onChange={(e) =>
                            setStartRange(Number(e.target.value))
                          }
                        >
                          <option>Choose month...</option>
                          <option value='1'>January</option>
                          <option value='2'>February</option>
                          <option value='3'>March</option>
                          <option value='4'>April</option>
                          <option value='5'>May</option>
                          <option value='6'>June</option>
                          <option value='7'>July</option>
                          <option value='8'>August</option>
                          <option value='9'>September</option>
                          <option value='10'>October</option>
                          <option value='11'>November</option>
                          <option value='12'>December</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group as={Col} sm={5}>
                        <Form.Label>END RANGE</Form.Label>
                        <Form.Control
                          size='sm'
                          as='select'
                          id='selecSecondtDate'
                          custom
                          onChange={(e) => setEndRange(Number(e.target.value))}
                        >
                          <option>Choose month...</option>
                          <option value='1'>January</option>
                          <option value='2'>February</option>
                          <option value='3'>March</option>
                          <option value='4'>April</option>
                          <option value='5'>May</option>
                          <option value='6'>June</option>
                          <option value='7'>July</option>
                          <option value='8'>August</option>
                          <option value='9'>September</option>
                          <option value='10'>October</option>
                          <option value='11'>November</option>
                          <option value='12'>December</option>
                        </Form.Control>
                      </Form.Group>
                    </Card.Title>
                    <LineChart
                      incomeTrend={incomeTrend}
                      expensesTrend={expensesTrend}
                      startRange={startRange}
                      endRange={endRange}
                    />
                  </Card.Body>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default HomeScreen
