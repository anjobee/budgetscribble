import React from 'react'
import { Line } from 'react-chartjs-2'

const LineChart = ({ incomeTrend, expensesTrend, startRange, endRange }) => {
  const expensesRearranged = [...Array(12)].map((m, i) => {
    return (
      expensesTrend.find(
        (expenseObject) => expenseObject._id.month === i + 1
      ) || {
        total: 0,
        _id: { month: i }
      }
    )
  })

  const incomeRearranged = [...Array(12)].map((m, i) => {
    return (
      incomeTrend.find((incomeObject) => incomeObject._id.month === i + 1) || {
        total: 0,
        _id: { month: i }
      }
    )
  })

  //MAKE A NEW ARRAY OF ONLY EXPENSES.TOTAL OBJECT KEY - 'total: 5000'
  const expensesArray = expensesRearranged
    .map((expenseObject) => expenseObject.total)
    .slice(startRange - 1, endRange)

  //MAKE A NEW ARRAY OF ONLY INCOME.TOTAL OBJECT KEY - 'total: 5000'
  const incomeArray = incomeRearranged
    .map((incomeObject) => incomeObject.total)
    .slice(startRange - 1, endRange)

  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ].slice(startRange - 1, endRange)

  return (
    <Line
      data={{
        labels: [...labels],
        datasets: [
          {
            label: 'Income',
            data: [...incomeArray],
            fill: true,
            borderColor: 'green',
            backgroundColor: 'rgba(204,240,234,.5)'
          },
          {
            label: 'Expenses',
            data: [...expensesArray],
            fill: true,
            borderColor: 'red',
            backgroundColor: 'rgba(240,204,210,.5)'
          }
        ]
      }}
      redraw={false}
    />
  )
}

export default LineChart
