import React from 'react'
import { Pie } from 'react-chartjs-2'

const PieChart = ({ categoryPieNames, categoryPieData }) => {
  const colors = []

  categoryPieNames.forEach((name) => {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16)
    colors.push(`#${randomColor}`)
  })

  return (
    <Pie
      data={{
        datasets: [
          {
            data: [...categoryPieData],
            backgroundColor: [...colors]
          }
        ],
        labels: [...categoryPieNames]
      }}
      redraw={false}
    />
  )
}

export default PieChart
