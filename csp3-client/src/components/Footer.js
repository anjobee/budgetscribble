import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            Copyright &copy; BudgetScribble | Favicon by:{' '}
            <a
              href='https://www.vecteezy.com/members/goff-brian'
              target='_blank'
              rel='noreferrer'
            >
              goff.brian
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
