import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import { Table, Button, Form, Modal, Card } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import {
  updateTransaction,
  deleteTransaction
} from '../actions/transactionActions'
import {
  TRANSACTION_EXPENSES_LIST_REQUEST,
  TRANSACTION_INCOME_LIST_REQUEST
} from '../constants/transactionConstants'

const TransactionTable = ({ outerElement }) => {
  //STATES FOR MODAL
  const [modalShow, setModalShow] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newDate, setNewDate] = useState(new Date())
  const [newAmount, setNewAmount] = useState(0)
  const [editName, setEditName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')
  const [editTransactionId, setEditTransactionId] = useState('')

  const handleShow = () => setModalShow(true)
  const handleClose = () => setModalShow(false)

  const dispatch = useDispatch()

  const submitHandler = () => {
    dispatch(
      updateTransaction(
        editCategoryId,
        editTransactionId,
        newName,
        newDesc,
        newAmount,
        newDate
      )
    )
    setNewName('')
    setNewDesc('')
    setNewAmount(0)
    setEditName('')
    dispatch({ type: TRANSACTION_INCOME_LIST_REQUEST })
    dispatch({ type: TRANSACTION_EXPENSES_LIST_REQUEST })
  }

  const deleteHandler = (categoryId, transactionId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteTransaction(categoryId, transactionId))
    }
  }

  return (
    <>
      <Modal show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Card.Body>
          <Card.Title>{editName}</Card.Title>
          <Form>
            <Form.Group controlId='newName'>
              <Form.Label>Transaction Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter new name'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='newDesc'>
              <Form.Label>Transaction Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter new description'
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='newAmount'>
              <Form.Label>Transaction Amount</Form.Label>
              <Form.Control
                type='number'
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select New Date</Form.Label>
              <br />
              <DatePicker
                selected={newDate}
                onChange={(d) =>
                  setNewDate(
                    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
                  )
                }
              />
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
              submitHandler()
              handleClose()
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Table striped hover responsive>
        <thead>
          <tr className='table-dark'>
            <th scope='col'>#</th>
            <th scope='col'>Transaction Name</th>
            <th scope='col'>Transaction Description</th>
            <th scope='col'>Amount</th>
            <th scope='col'>Date</th>
            <th scope='col'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {outerElement.map((outer) => {
            return outer.transactionList.map((innerElement, index) => (
              <tr
                key={`tr-${index}`}
                className={
                  innerElement.itemType === 'income'
                    ? 'table-success'
                    : 'table-danger'
                }
              >
                <th scope='row'>{index + 1}</th>
                <td>{innerElement.transactionName}</td>
                <td>{innerElement.transactionDesc}</td>
                <td>
                  &#8369;{innerElement.transactionAmount.toLocaleString()}
                </td>
                <td>{innerElement.timestamp.slice(0, 10)}</td>
                <td>
                  {' '}
                  <Button
                    variant='light'
                    className='btn-sm'
                    onClick={() => {
                      handleShow()
                      setEditCategoryId(outer._id)
                      setEditTransactionId(innerElement._id)
                      setEditName(
                        `Item #${index + 1} - ${
                          innerElement.transactionName
                        } - ${innerElement.itemType.toUpperCase()}`
                      )
                      setNewName(innerElement.transactionName)
                      setNewDesc(innerElement.transactionDesc)
                      setNewAmount(innerElement.transactionAmount)
                      setNewDate(new Date(innerElement.timestamp.slice(0, 10)))
                    }}
                    key={`button-${index}`}
                  >
                    <i className='fas fa-edit'></i>
                  </Button>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(outer._id, innerElement._id)}
                    key={`button-${index + 1}`}
                  >
                    <i className='fas fa-trash'></i>
                  </Button>
                </td>
              </tr>
            ))
          })}
        </tbody>
      </Table>
    </>
  )
}

export default TransactionTable
