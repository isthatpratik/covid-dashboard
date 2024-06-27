import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }) => {
  const years = ['2019', '2020', '2021', '2022', '2023'];

  const sumDataByYear = (dataArr, dates) => {
    const yearlyData = {};
    dates.forEach((date, index) => {
      const year = new Date(date).getFullYear();
      if (years.includes(year.toString())) {
        if (!yearlyData[year]) yearlyData[year] = 0;
        yearlyData[year] += dataArr[index];
      }
    });
    return years.map((year) => yearlyData[year] || 0);
  };

  const casesData = sumDataByYear(data.cases, data.dates);
  const recoveriesData = sumDataByYear(data.recoveries, data.dates);
  const deathsData = sumDataByYear(data.deaths, data.dates);

  const normalizeData = (dataArr, maxVal) => {
    if (maxVal === 0) return dataArr;
    const scaleFactor = 1000000;
    return dataArr.map((val) => (val / maxVal) * scaleFactor);
  };

  const maxCases = Math.max(...casesData);
  const maxRecoveries = Math.max(...recoveriesData);
  const maxDeaths = Math.max(...deathsData);
  const globalMax = Math.max(maxCases, maxRecoveries, maxDeaths);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Cases',
        data: normalizeData(casesData, globalMax),
        borderColor: '#9CA8FF',
        fill: false,
        pointRadius: 2,
      },
      {
        label: 'Recoveries',
        data: normalizeData(recoveriesData, globalMax),
        borderColor: '#47D829',
        fill: false,
        pointRadius: 2,
      },
      {
        label: 'Deaths',
        data: normalizeData(deathsData, globalMax),
        borderColor: '#FF4C56',
        fill: false,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    beginAtZero: true,
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.4,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Line Chart',
        align: 'start',
        color: 'black',
        font: {
          weight: 'bold',
          size: 18,
        },
        padding: {
          bottom: 25,
        },
      },
    },
    scales: {
      x: {
        offset: 10,
        title: {
          display: true,
          color: 'black',
          font: {
            weight: 'bold',
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: 'black',
          font: {
            weight: 'bold',
          },
        },
        border: {
          color: 'black',
          width: 3,
        },
      },
      y: {
        min: 0,
        ticks: {
          color: 'black',
          font: {
            weight: 'bold',
          },
          stepSize: 200000, 
          callback: function (value) {
            return (value / 1000000).toFixed(1); 
          },
        },
        grid: {
          display: false,
        },
        border: {
          color: 'black',
          width: 3,
        },
      },
    },
  };

  return <Line className="w-full px-4 py-4" data={chartData} options={options} />;
};

export default LineChart;
