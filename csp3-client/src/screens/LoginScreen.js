import React, { useState, useEffect } from 'react'
import { GoogleLogin } from 'react-google-login'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Meta from '../components/Meta'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { login, googleLogin } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { error, userInfo } = userLogin

  const userGoogleLogin = useSelector((state) => state.userGoogleLogin)
  const { error: googleError } = userGoogleLogin

  const redirect = location.search
    ? location.search.split('=')[1]
    : '/dashboard'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  function authenticateGoogleToken(response) {
    dispatch(googleLogin(response.tokenId))
  }

  return (
    <Container className='mt-5'>
      <Meta title='Sign In | BudgetScribble' />
      <Row>
        <Col sm={12} md={6} className='mx-auto'>
          <Card>
            <Card.Header className='common-card'>Sign In</Card.Header>
            <Card.Body>
              {googleError && <Message variant='danger'>{googleError}</Message>}
              {error && <Message variant='danger'>{error}</Message>}
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

                <Form.Group controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                  Sign In
                </Button>

                <GoogleLogin
                  clientId='199785162960-c9o2kpqalpkmulip8hdua8i2arbvq45m.apps.googleusercontent.com'
                  buttonText='Login using Gmail'
                  onSuccess={authenticateGoogleToken}
                  onFailure={authenticateGoogleToken}
                  cookiePolicy={'single_host_origin'}
                  className='w-100 d-flex justify-content-center mt-3'
                />
              </Form>

              <Row className='py-3'>
                <Col>
                  New Here? <Link to='/register'>Register</Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default LoginScreen
