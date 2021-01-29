import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Meta from '../components/Meta'
import { forgotPassword } from '../actions/userActions'
import Swal from 'sweetalert2'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [submitError, setSubmitError] = useState('')

  const dispatch = useDispatch()

  const userForgotPassword = useSelector((state) => state.userForgotPassword)
  const { success, message, error } = userForgotPassword

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
        window.location.reload()
      }, 1800)
    }
  }, [success])

  const submitHandler = (e) => {
    e.preventDefault()
    if (email.length > 6) {
      dispatch(forgotPassword(email))
    } else {
      setSubmitError('Please enter a valid email address')
      return
    }
  }

  return (
    <Container className='mt-5'>
      <Meta title='Forgot Password | BudgetScribble' />
      <Row>
        <Col sm={12} md={6} className='mx-auto'>
          <Card>
            <Card.Header className='common-card'>Forgot Password</Card.Header>
            <Card.Body>
              {error ? (
                <Message>{error}</Message>
              ) : (
                submitError && <Message>{submitError}</Message>
              )}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button
                  type='submit'
                  className='btn btn-block'
                  variant='primary'
                >
                  Send
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ForgotPasswordScreen
