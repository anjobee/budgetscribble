import React from 'react'
import { Table } from 'react-bootstrap'

const CategoryTable = ({ children }) => {
  return (
    <Table striped hover responsive>
      <thead>
        <tr className='table-dark'>
          <th scope='col'>#</th>
          <th scope='col'>CATEGORY NAME</th>
          <th scope='col'>CATEGORY DESCRIPTION</th>
          <th scope='col' className='text-center'>
            TRANSACTION ENTRIES
          </th>
          <th scope='col'>TOTAL AMOUNT</th>
          <th scope='col'>ACTIONS</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  )
}

export default CategoryTable
