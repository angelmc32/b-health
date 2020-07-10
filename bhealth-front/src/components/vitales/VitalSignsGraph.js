import React, { createRef, useEffect } from 'react'
import moment from 'moment';                                        // Import momentjs for date formatting
import 'moment/locale/es'  // without this line it didn't work
import Chart from 'chart.js';

const VitalSignsGraph = ({vitalsigns}) => {

  const chartRef = createRef();

  const chartColors = {
    white: 'rgb(255,255,255)',
    red: 'rgb(170,15,26)',
    turqoise: 'rgb(5,159,153)',
    pink: 'rgb(255,72,169)',
    darkBlue: 'rgb(0,53,135)',
    black: 'rgb(0,0,0)',
    orange: 'rgb(280,92,36)',
    green: 'rgb(88,188,41)',
    yellow: 'rgb(220, 226, 45)'
  }

  useEffect(() => {

    const myChart = new Chart(chartRef.current, {
      type: 'line',
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                unit: 'day'
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        }
      },
      data: {
        labels: vitalsigns.map( record => record.date),
        datasets: [
          {
            label: 'Presión Sistólica',
            data: vitalsigns.map( record => record.blood_pressure_sys ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.red,
            backgroundColor: chartColors.red,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.red,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Presión Diastólica',
            data: vitalsigns.map( record => record.blood_pressure_dias ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.darkBlue,
            backgroundColor: chartColors.darkBlue,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.darkBlue,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Frecuencia Cardiaca',
            data: vitalsigns.map( record => record.heart_rate ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.turqoise,
            backgroundColor: chartColors.turqoise,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.turqoise,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Frecuencia Respiratoria',
            data: vitalsigns.map( record => record.resp_rate ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.pink,
            backgroundColor: chartColors.pink,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.pink,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Temperatura',
            data: vitalsigns.map( record => record.temperature ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.orange,
            backgroundColor: chartColors.orange,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.orange,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Glucosa en Sangre',
            data: vitalsigns.map( record => record.blood_sugar ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.green,
            backgroundColor: chartColors.green,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.green,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Altura',
            data: vitalsigns.map( record => record.height ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.yellow,
            backgroundColor: chartColors.yellow,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.yellow,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
          {
            label: 'Peso',
            data: vitalsigns.map( record => record.weight ),
            fill: false,

            borderWidth: 2,
            borderColor: chartColors.black,
            backgroundColor: chartColors.black,

            pointBorderWidth: 2,
            pointBackgroundColor: chartColors.white,
            pointBorderColor: chartColors.black,
            pointRadius: 4,

            pointHoverBorderWidth: 4,
            pointHoverBackgroundColor: "#ffffff",
            pointHoverBorderColor: "#ff8a89",
            pointHoverRadius: 4
          },
        ]
      }
      ,
      backgroundColor: '#112233'
    })
  },[])

  return (
    <div className="uk-height-1-2">
      <canvas id="myChart" ref={chartRef} />
    </div>
  )
}

export default VitalSignsGraph
