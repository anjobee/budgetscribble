import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { logout } from '../actions/userActions'

const Header = () => {
  const dispatch = useDispatch()

  const categoryList = useSelector((state) => state.categoryList)
  const { total } = categoryList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' fixed='top' collapseOnSelect>
        <Container className='px-5' fluid>
          <LinkContainer to={userInfo ? '/dashboard' : '/'}>
            <Navbar.Brand className='mr-auto'>
              {' '}
              <img
                src='/logo.png'
                width='30'
                height='30'
                className='d-inline-block align-center'
                alt='coin'
              />
              BudgetScribble
            </Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='mr-auto mx-5'>
              {userInfo && (
                <>
                  <Nav.Link className='px-3'>
                    <i className='fas fa-money-bill text-white mr-1'></i>$
                    {total}
                  </Nav.Link>
                  <LinkContainer to='/dashboard'>
                    <Nav.Link className='px-3'>
                      <i className='fas fa-home pr-1'></i>Dashboard
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/categories/income'>
                    <Nav.Link className='px-3'>
                      <i className='fas fa-hand-holding-usd pr-1'></i>Income
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/categories/expenses'>
                    <Nav.Link className='px-3'>
                      <i className='fas fa-money-bill-wave pr-1'></i>Expenses
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
              {userInfo && userInfo.loginType === 'email' ? (
                <NavDropdown
                  title={userInfo.firstName}
                  id='username'
                  className='px-3'
                >
                  <LinkContainer to='/changepassword'>
                    <NavDropdown.Item>Change Password</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : userInfo && userInfo.loginType === 'google' ? (
                <NavDropdown
                  title={userInfo.firstName}
                  id='username'
                  className='px-3'
                >
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <LinkContainer to='/'>
                    <Nav.Link>
                      <i className='fas fa-user px-1'></i>Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to='/register'>
                    <Nav.Link>
                      <i className='fas fa-user-plus px-1'></i>Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
