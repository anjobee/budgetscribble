import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='keyword' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to BudgetScribble',
  keywords: 'budget tracker, money tracking app'
}

export default Meta
