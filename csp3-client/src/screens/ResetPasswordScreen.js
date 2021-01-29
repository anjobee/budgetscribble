import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { resetPassword } from '../actions/userActions'
import Swal from 'sweetalert2'

const ResetPasswordScreen = ({ history }) => {
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [submitError, setSubmitError] = useState('')

  const dispatch = useDispatch()

  const userResetPassword = useSelector((state) => state.userResetPassword)
  const { success, message, error } = userResetPassword

  useEffect(() => {
    if (success) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1800
      })
      setTimeout(() => {
        history.push('/')
      }, 1800)
    }
  }, [success])

  const submitHandler = (e) => {
    e.preventDefault()
    if (newPassword.length < 6) {
      setSubmitError('Password needs to be at least 6 characters in length.')
      return
    }

    if (newPassword !== confirmNewPassword) {
      setSubmitError('Passwords do not match.')
      return
    } else {
      dispatch(resetPassword(newPassword, resetToken))
    }
  }

  return (
    <Container className='mt-5'>
      <Meta title='Reset Password | BudgetScribble' />
      <Row>
        <Col sm={12} md={6} className='mx-auto'>
          <Card>
            <Card.Header className='common-card'>Reset Password</Card.Header>
            <Card.Body>
              {error ? (
                <Message>{error}</Message>
              ) : (
                submitError && <Message>{submitError}</Message>
              )}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='resetToken'>
                  <Form.Label>Reset Token</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='Enter reset token'
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='newPassword'>
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmNewPassword'>
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button
                  type='submit'
                  className='btn btn-block'
                  variant='primary'
                >
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ResetPasswordScreen
