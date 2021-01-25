import React, { useState } from 'react'
import { Form, Button, Container, Card, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Meta from '../components/Meta'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { changePassword } from '../actions/userActions'

const ChangePasswordScreen = () => {
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()

  const userChangePassword = useSelector((state) => state.userChangePassword)
  const { loading, success, error } = userChangePassword

  const submitHandler = (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setMessage('New passwords do not match')
    } else {
      dispatch(changePassword(password, newPassword))
      setPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    }
  }

  return (
    <Container className='mt-5'>
      <Meta title='Change Password | BudgetScribble' />
      {loading && <Loader />}
      <Row>
        <Col sm={12} md={6} className='mx-auto'>
          <Card>
            <Card.Header className='common-card'>Change Password</Card.Header>
            <Card.Body>
              {success && (
                <Message variant='success'>
                  Password changed successfully!
                </Message>
              )}
              {message && <Message>{message}</Message>}
              {error && <Message>{error}</Message>}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='oldPassword'>
                  <Form.Label>Old Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter old password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='password'>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter new password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword'>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm new password'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ChangePasswordScreen
