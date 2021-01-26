import React, { useState, useMemo, useEffect } from 'react'
import { Table, Button, Modal, Form, Card, Row, Col } from 'react-bootstrap'
import DatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import {
  updateTransaction,
  deleteTransaction
} from '../actions/transactionActions'
import Paginate from './Paginate'

const TransactionRecords = () => {
  //STATES FOR MODAL)
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

  const updateHandler = () => {
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
    setNewAmount(0)
    setEditName('')
  }

  const deleteHandler = (categoryId, transactionId) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteTransaction(categoryId, transactionId))
    }
  }

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
    if (loadingTransactionRecords) return
    let computedRecords = filterQuery(filter)

    setTotalItems(computedRecords.length)

    return computedRecords.slice(
      (currentPage - 1) * itemsPerRecord,
      (currentPage - 1) * itemsPerRecord + itemsPerRecord
    )
  }, [filter, currentPage, successTransactionRecords])

  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

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
              updateHandler()
              handleClose()
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {recordData && (
        <>
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
          <Table striped hover responsive>
            <thead>
              <tr className='table-dark'>
                <th scope='col'>DATE</th>
                <th scope='col'>CATEGORY</th>
                <th scope='col'>TYPE</th>
                <th scope='col'>TRANSACTION NAME</th>
                <th scope='col'>TOTAL AMOUNT</th>
                <th scope='col'>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {recordData.map((transaction, index) => (
                <tr
                  key={index + 1}
                  className={
                    transaction.transactionList.itemType === 'income'
                      ? 'table-success'
                      : 'table-danger'
                  }
                >
                  <td>{transaction.transactionList.timestamp.slice(0, 10)}</td>
                  <td>{transaction.categoryName}</td>
                  <td>{transaction.transactionList.itemType.toUpperCase()}</td>
                  <td>{transaction.transactionList.transactionName}</td>
                  <td>
                    {transaction.transactionList.itemType === 'expenses'
                      ? `-₱${transaction.transactionList.transactionAmount.toLocaleString()}`
                      : `₱${transaction.transactionList.transactionAmount.toLocaleString()}`}
                  </td>
                  <td>
                    {' '}
                    <Button
                      variant='light'
                      className='btn-sm'
                      onClick={() => {
                        handleShow()
                        setEditCategoryId(transaction._id)
                        setEditTransactionId(transaction.transactionList._id)
                        setEditName(
                          `Item #${index + 1} - ${
                            transaction.transactionList.transactionName
                          } - ${transaction.transactionList.itemType.toUpperCase()}`
                        )
                        setNewName(transaction.transactionList.transactionName)
                        setNewAmount(
                          transaction.transactionList.transactionAmount
                        )
                        setNewDate(
                          new Date(
                            transaction.transactionList.timestamp.slice(0, 10)
                          )
                        )
                      }}
                      key={`button-${index}`}
                    >
                      <i className='fas fa-edit'></i>
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() =>
                        deleteHandler(
                          transaction._id,
                          transaction.transactionList._id
                        )
                      }
                      key={`button-${index + 1}`}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  )
}

export default TransactionRecords
