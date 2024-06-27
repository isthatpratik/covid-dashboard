import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedCountry }) => {
  const [chartData, setChartData] = useState({
    deaths: 0,
    cases: 0,
    population: 0,
  });

  useEffect(() => {
    if (!selectedCountry) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`https://disease.sh/v3/covid-19/countries/${selectedCountry}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChartData({
          deaths: data.deaths,
          cases: data.cases,
          recoveries: data.recoveries,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCountry]);

  const { cases, deaths, recoveries } = chartData;

  const doughnutData = {
    labels: ['Total Deaths', 'Total Cases', 'Recovered Population'],
    datasets: [
      {
        data: [
          deaths,
          cases,
          recoveries,
        ],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(255, 205, 86, 0.6)', 'rgba(75, 192, 192, 0.6)'],
        hoverBackgroundColor: ['rgba(255, 99, 132, 1)', 'rgba(255, 205, 86, 1)', 'rgba(75, 192, 192, 1)'],
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Pie Chart',
        align: 'start',
        color: 'black',
        font: {
          size: 18,
          weight: 'bold',
        },
        margin: {
          top: 0
        }
      },
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 0.8,
  };

  return (
    <div className="chart">
      <Doughnut data={doughnutData} options={doughnutOptions} />
    </div>
  );
};

export default PieChart;
