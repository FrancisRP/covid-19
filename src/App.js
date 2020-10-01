import React ,{useState, useEffect} from 'react';
import './App.css';
import { 
  FormControl,
  MenuItem,
  Select  } from '@material-ui/core';
import InfoBox from './Components/InfoBox'
import Map from './Components/Map'
import {Card, CardContent, Typography} from '@material-ui/core'
import {sortData, prettyPrintStat } from './Components/util'
import Table from './Components/Table'
import LineGraph from './Components/LineGraph'
import "leaflet/dist/leaflet.css"

  // https://disease.sh/v3/covid-19/countries


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3)
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases") 

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
          setMapCountries(data);
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

      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(5)
    })
  }
  console.log(countryInfo)


  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
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
              
              active={casesType === "cases"}
              isRed
              onClick ={e => setCasesType("cases")}
              title={"Coronavirus cases"}
              total={prettyPrintStat(countryInfo.cases)}
              cases={prettyPrintStat(countryInfo.todayCases)}
            />

            <InfoBox
              active={casesType === "recovered"}
              onClick ={e => setCasesType("recovered")}
              title="Recovered"
              total={prettyPrintStat(countryInfo.recovered)}
              cases={prettyPrintStat(countryInfo.todayRecovered)}
            />

            <InfoBox
             
              active={casesType === "deaths"}
              isRed
              onClick ={e => setCasesType("deaths")}
              title="Deaths"
              total={prettyPrintStat(countryInfo.deaths)}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
            />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData}/>
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
