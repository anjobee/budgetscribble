import React from 'react'
import { Line } from 'react-chartjs-2'

const LineChart = ({ incomeTrend, expensesTrend, startRange, endRange }) => {
  const expensesRearrange = [...Array(12)].map((m, i) => {
    return (
      expensesTrend.find((d) => d._id.month === i + 1) || {
        total: 0,
        _id: { month: i }
      }
    )
  })

  const incomeRearrange = [...Array(12)].map((m, i) => {
    return (
      incomeTrend.find((d) => d._id.month === i + 1) || {
        total: 0,
        _id: { month: i }
      }
    )
  })

  const expensesArray = expensesRearrange
    .map((x) => x.total)
    .slice(startRange - 1, endRange)

  const incomeArray = incomeRearrange
    .map((x) => x.total)
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
