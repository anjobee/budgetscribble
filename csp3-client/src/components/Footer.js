import React from 'react'
import { Container, Row, Col, Navbar } from 'react-bootstrap'

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            &copy; 2020 BudgetScribble | All Rights Reserved | Favicon by:{' '}
            <a
              href='https://www.vecteezy.com/members/goff-brian'
              target='_blank'
              rel='noreferrer'
            >
              goff.brian
            </a>{' '}
            | Theme by:{' '}
            <a href='https://bootswatch.com/' target='_blank' rel='noreferrer'>
              Thomas Park
            </a>{' '}
            {/* | Is It Cool? Contact Me! */}
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
