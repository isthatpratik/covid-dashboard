import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatsCard from './components/StatsCard';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import { IoSearchOutline } from 'react-icons/io5';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [historicalData, setHistoricalData] = useState({
    dates: [],
    cases: [],
    recoveries: [],
    deaths: [],
  });
  const [filteredData, setFilteredData] = useState({
    dates: [],
    cases: [],
    recoveries: [],
    deaths: [],
  });
  const [stats, setStats] = useState({
    cases: 0,
    recoveries: 0,
    deaths: 0,
  });
  const [dateRange, setDateRange] = useState([new Date(2019, 3, 24), new Date()]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        const countryList = response.data
          .map((country) => ({
            name: country.name.common,
            cca2: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  useEffect(() => {
    if (!selectedCountry) return;

    fetchData(selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !historicalData.dates.length) return;

    filterDataByDateRange();
  }, [dateRange, historicalData]);

  const fetchData = (countryCode) => {
    axios
      .get(`https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=all`)
      .then((response) => {
        const { cases, recovered, deaths } = response.data.timeline;
        const dates = Object.keys(cases);

        setHistoricalData({
          dates,
          cases: Object.values(cases),
          recoveries: Object.values(recovered),
          deaths: Object.values(deaths),
        });

        filterDataByDateRange({
          dates,
          cases: Object.values(cases),
          recoveries: Object.values(recovered),
          deaths: Object.values(deaths),
        });
      })
      .catch((error) => console.error('Error fetching historical data:', error));
  };

  const filterDataByDateRange = (data = historicalData) => {
    const { dates, cases, recoveries, deaths } = data;
    const filteredDates = [];
    const filteredCases = [];
    const filteredRecoveries = [];
    const filteredDeaths = [];

    let totalCases = 0;
    let totalRecoveries = 0;
    let totalDeaths = 0;

    for (let i = 0; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      if (currentDate >= startDate && currentDate <= endDate) {
        filteredDates.push(dates[i]);
        filteredCases.push(cases[i]);
        filteredRecoveries.push(recoveries[i]);
        filteredDeaths.push(deaths[i]);

        totalCases = cases[i];
        totalRecoveries = recoveries[i];
        totalDeaths = deaths[i];
      }
    }

    setFilteredData({
      dates: filteredDates,
      cases: filteredCases,
      recoveries: filteredRecoveries,
      deaths: filteredDeaths,
    });

    setStats({
      cases: Math.floor(totalCases / 1000000),
      recoveries: Math.floor(totalRecoveries / 1000000),
      deaths: Math.floor(totalDeaths / 1000000),
    });
  };

  return (
    <div className="container flex-auto">
      <h1 className="title">COVID-19 and Population Dashboard</h1>
      <div className="controls space-y-4 md:space-y-0 md:space-x-4">
        <div className="select-container">
          <IoSearchOutline className="search-icon" />
          <select
            className="select"
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setHistoricalData({
                dates: [],
                cases: [],
                recoveries: [],
                deaths: [],
              });
            }}
          >
            <option className="text-gray-950" value="">Select a country</option>
            {countries.map((country) => (
              <option key={country.cca2} value={country.cca2}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="date-picker-wrapper">
          <label className="date-picker-label">Filter by Date Range</label>
          <div className="date-picker-container">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select date range"
              className="date-picker-input"
            />
          </div>
        </div>
      </div>
      <div className="stats-grid px-4 md:px-0">
        <StatsCard title="Total Cases" value={`${stats.cases}M`} color="purple" />
        <StatsCard title="Recoveries" value={`${stats.recoveries}M`} color="green" />
        <StatsCard title="Deaths" value={`${stats.deaths}M`} color="red" />
      </div>
      <div className="charts-grid px-4 md:px-0">
        <div className="chart chart-line">
          <LineChart data={filteredData} />
        </div>
        {selectedCountry && (
          <div className="chart chart-pie">
            <PieChart selectedCountry={selectedCountry} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
