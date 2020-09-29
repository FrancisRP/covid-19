import React ,{useState, useEffect} from 'react';
import './App.css';
import { 
  FormControl,
  MenuItem,
  Select  } from '@material-ui/core';
import InfoBox from './Components/InfoBox'
import Map from './Components/Map'
import {Card, CardContent, Typography} from '@material-ui/core'
import {sortData } from './Components/util'
import Table from './Components/Table'

  // https://disease.sh/v3/covid-19/countries


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) =>  (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }
          ))
          const sortedData = sortData(data);
          setTableData(sortedData)
          setCountries(countries)
        })
      };
      getCountriesData();
  }, [])

  const onCountryChange = async (event) =>{
    const countryCode = event.target.value;
    

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
      setCountryInfo(data)
    })
  }
  console.log(countryInfo)


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>KIKOVID-19 TRACKER</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
            <InfoBox
              title={"Coronavirus cases"}
              total={countryInfo.cases}
              cases={countryInfo.todayCases}
            />

            <InfoBox
              title="Recovered"
              total={countryInfo.recovered}
              cases={countryInfo.todayRecovered}
            />

            <InfoBox
              title="Deaths"
              total={countryInfo.deaths}
              cases={countryInfo.todayDeaths}
            />
        </div>
        <Map />
      </div>
      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>Worldwide new Cases</h3>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
