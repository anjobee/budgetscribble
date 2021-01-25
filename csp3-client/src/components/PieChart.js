import React from 'react'
import { Pie } from 'react-chartjs-2'

const PieChart = ({ totalIncome, totalExpenses }) => {
  const percentage = (rawTotal) => {
    return (rawTotal / Math.floor(totalIncome + totalExpenses)) * 100
  }

  let dataArray = []

  dataArray.push(percentage(totalIncome).toFixed(2))
  dataArray.push(percentage(totalExpenses).toFixed(2))

  return (
    <Pie
      data={{
        datasets: [
          {
            data: [...dataArray],
            backgroundColor: ['#ccf0ea', '#f0ccd2']
          }
        ],
        labels: ['Income %', 'Expenses %']
      }}
      redraw={false}
    />
  )
}

export default PieChart
