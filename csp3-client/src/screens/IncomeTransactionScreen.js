import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Link } from 'react-router-dom'
import {
  Form,
  Button,
  Container,
  Col,
  Row,
  Accordion,
  Card
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import TransactionTable from '../components/TransactionTable'
import Meta from '../components/Meta'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getTransactionIncomeList,
  addTransaction
} from '../actions/transactionActions'

const IncomeTransactionScreen = () => {
  const [categoryName, setCategoryName] = useState('')
  const [transactionName, setTransactionName] = useState('')
  const [transactionDescription, setTransactionDescription] = useState('')
  const [transactionAmount, setTransactionAmount] = useState(0)
  const [date, setDate] = useState(new Date())

  const dispatch = useDispatch()

  const transactionIncomeList = useSelector(
    (state) => state.transactionIncomeList
  )
  const { loading, list } = transactionIncomeList

  const transactionAdd = useSelector((state) => state.transactionAdd)
  const { success, error: errorAdd } = transactionAdd

  const transactionUpdate = useSelector((state) => state.transactionUpdate)
  const { success: successUpdate } = transactionUpdate

  const transactionDelete = useSelector((state) => state.transactionDelete)
  const { success: successDelete, error: errorDelete } = transactionDelete

  useEffect(() => {
    dispatch(getTransactionIncomeList())
  }, [dispatch, success, successUpdate, successDelete])

  const submitHandler = (e) => {
    e.preventDefault()
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

  return (
    <>
      <Meta title='Income Transaction | BudgetScribble' />
      <Link to='/' className='btn btn-dark my-3 mr-3'>
        Go Back
      </Link>
      <Link to='/categories/income' className='btn btn-dark my-3'>
        Income: Categories
      </Link>
      <i className='fas fa-angle-double-right'></i>
      <Link to='/transactions/income'>
        <Button disabled>Income: Transactions</Button>
      </Link>
      <Container className='jumbotron' fluid>
        {errorDelete && <Message>{errorDelete}</Message>}
        {loading ? (
          <Loader />
        ) : errorAdd ? (
          <Message>{errorAdd}</Message>
        ) : (
          <>
            <Row>
              <Col>
                {' '}
                <Card className='border-success mb-5'>
                  <Card.Header className='income-card'>
                    ADD INCOME TRANSACTION
                  </Card.Header>
                  <Card.Body>
                    {' '}
                    <Form onSubmit={submitHandler}>
                      <Form.Row>
                        <Form.Group as={Col}>
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
                            {list.map((category, index) => (
                              <option
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
                          className='mt-1'
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

                      <Button type='submit' variant='primary'>
                        Add
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={12} md={12} lg={6}>
                <Accordion>
                  {list.map((outerElement, index) => (
                    <Card
                      key={`card-${index}`}
                      className='text-center bg-success'
                    >
                      <Card.Header key={`header-${index}`}>
                        <Accordion.Toggle
                          as={Button}
                          variant='link'
                          eventKey={outerElement.categoryName}
                          key={`acc-toggle-${index}`}
                        >
                          <i className='fas fa-angle-double-down fa-2x mr-2'></i>
                          <div>
                            {outerElement.categoryName}
                            {' - '} &#8369;
                            {outerElement.totalTransactionAmount.toLocaleString()}
                          </div>
                        </Accordion.Toggle>
                      </Card.Header>
                      <Accordion.Collapse
                        eventKey={outerElement.categoryName}
                        key={`acc-collapse-${index}`}
                      >
                        <Card.Body key={`body-${index}`}>
                          <TransactionTable
                            outerElement={[outerElement]}
                            key={`table-${index}`}
                          />
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))}
                </Accordion>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  )
}

export default IncomeTransactionScreen
