import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Meta from '../components/Meta'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
  //CHECK USER INFO
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/dashboard'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()

  const formData = { firstName, lastName, email, password }

  const userRegister = useSelector((state) => state.userRegister)
  const { success, error } = userRegister

  useEffect(() => {
    if (success) {
      history.push('/')
    }
  }, [success])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password.length < 3) {
      setMessage('Password needs to be more than 2 characters!')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(formData))
    }
  }

  return (
    <Container className='mt-5'>
      <Meta title='Register | BudgetScribble' />
      <Row>
        <Col sm={12} md={6} className='mx-auto'>
          <Card>
            <Card.Header className='common-card'>Sign Up</Card.Header>
            <Card.Body>
              {message && <Message variant='danger'>{message}</Message>}
              {error && <Message variant='danger'>{error}</Message>}
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='firstName'>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter first name'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='lastName'>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type='name'
                    placeholder='Enter last name'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId='confirmPassword'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                  Register
                </Button>
              </Form>

              <Row className='py-3'>
                <Col>
                  Have an Account? <Link to={'/'}>Login</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default RegisterScreen
