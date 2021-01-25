import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Container, Row, Col, Card, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CategoryTable from '../components/CategoryTable'
import Meta from '../components/Meta'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  getCategoryIncomeList,
  addCategoryIncome,
  updateCategory,
  deleteCategory
} from '../actions/categoryActions'
import { CATEGORY_LIST_INCOME_REQUEST } from '../constants/categoryConstants'

const IncomeCategoryScreen = ({ history }) => {
  const [categoryName, setCategoryName] = useState('')
  const [categoryDescription, setCategoryDescription] = useState('')

  //STATES FOR MODAL
  const [modalShow, setModalShow] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [editName, setEditName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')

  const handleShow = () => setModalShow(true)
  const handleClose = () => setModalShow(false)

  const dispatch = useDispatch()

  const categoryIncomeList = useSelector((state) => state.categoryIncomeList)
  const { loading, list, error } = categoryIncomeList

  const categoryAddIncome = useSelector((state) => state.categoryAddIncome)
  const { success, category, error: errorCategory } = categoryAddIncome

  const categoryUpdate = useSelector((state) => state.categoryUpdate)
  const { success: successUpdate } = categoryUpdate

  const categoryDelete = useSelector((state) => state.categoryDelete)
  const { success: successDelete, error: errorDelete } = categoryDelete

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!userInfo) {
    history.push('/login')
  }

  useEffect(() => {
    dispatch(getCategoryIncomeList())
  }, [dispatch, success, category, successUpdate, successDelete])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(addCategoryIncome(categoryName, categoryDescription))
    setCategoryName('')
    setCategoryDescription('')
  }

  const editSubmitHandler = () => {
    dispatch(updateCategory(editCategoryId, newName, newDesc))
    setNewName('')
    setNewDesc('')
    setEditName('')
    dispatch({ type: CATEGORY_LIST_INCOME_REQUEST })
  }

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCategory(id))
    }
  }

  return (
    <>
      <Meta title='Income Category | BudgetScribble' />
      <Link to='/' className='btn btn-dark my-3 mr-3'>
        Go Back
      </Link>
      <Link to='/categories/income'>
        <Button disabled>Income: Categories</Button>
      </Link>
      <i className='fas fa-angle-double-right'></i>
      <Link to='/transactions/income' className='btn btn-dark my-3'>
        Income: Transactions
      </Link>
      <Container className='jumbotron' fluid>
        <Modal show={modalShow} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Card.Body>
            <Card.Title>{editName}</Card.Title>
            <Form>
              <Form.Group controlId='newName'>
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter new name'
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group controlId='newDesc'>
                <Form.Label>Category Description</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter new description'
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Form>
          </Card.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={handleClose}>
              Close
            </Button>
            <Button
              variant='primary'
              onClick={() => {
                editSubmitHandler()
                handleClose()
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Row>
          <Col sm={12} md={12} lg={4}>
            {' '}
            <Card className='mb-5 border-success'>
              <Card.Header className='income-card'>
                ADD INCOME CATEGORY
              </Card.Header>
              <Card.Body>
                <Form onSubmit={submitHandler}>
                  <Form.Group controlId='categoryName'>
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter category name'
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Form.Group controlId='categoryDescription'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter category description'
                      value={categoryDescription}
                      onChange={(e) => setCategoryDescription(e.target.value)}
                    ></Form.Control>
                  </Form.Group>

                  <Button type='submit' variant='primary'>
                    Add
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            {errorCategory && <Message>{errorCategory}</Message>}
          </Col>
          <Col>
            {' '}
            {errorDelete && <Message>{errorCategory}</Message>}
            {loading ? (
              <Loader />
            ) : error ? (
              <Message>{error}</Message>
            ) : (
              <Card className='border-success'>
                <Card.Header className='income-card'>
                  INCOME CATEGORY LIST
                </Card.Header>
                <Card.Body>
                  <CategoryTable>
                    {list.map((category, index) => (
                      <tr key={index + 1} className='table-success'>
                        <th scope='row'>{index + 1}</th>
                        <td>{category.categoryName}</td>
                        <td>{category.categoryDesc}</td>
                        <td className='text-center'>
                          {category.transactionCount}
                        </td>
                        <td>
                          &#8369;
                          {category.totalTransactionAmount.toLocaleString()}
                        </td>
                        <td>
                          {' '}
                          <Button
                            variant='light'
                            className='btn-sm'
                            onClick={() => {
                              handleShow()
                              setEditCategoryId(category._id)
                              setEditName(
                                `Item #${index + 1} - ${
                                  category.categoryName
                                } - ${category.transactionType.toUpperCase()}`
                              )
                              setNewName(category.categoryName)
                              setNewDesc(category.categoryDesc)
                            }}
                            key={`button-${index}`}
                          >
                            <i className='fas fa-edit'></i>
                          </Button>
                          <Button
                            variant='danger'
                            className='btn-sm'
                            onClick={() => deleteHandler(category._id)}
                          >
                            <i className='fas fa-trash'></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </CategoryTable>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default IncomeCategoryScreen
