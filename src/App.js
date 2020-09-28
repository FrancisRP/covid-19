import React ,{useState, useEffect} from 'react';
import './App.css';
import { 
  FormControl,
  MenuItem,
  Select  } from '@material-ui/core';

  // https://disease.sh/v3/covid-19/countries


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("World Wide")

  useEffect(() => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) =>  (
            {
              name: country.country ,
              value: country.countryInfo.iso2
            }
          ))
          setCountries(countries)
        })
      };
      getCountriesData();
  }, [])

  const onCountryChange = (event) =>{
    const countryCode = event.target.value;
    console.log(countryCode);
    setCountry(countryCode);
  }
  return (
    <div className="app">
      <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
        <FormControl className="app_dropdown">
          <Select
            variant="outlined"
            defaultvalue={country}
            onChange={onCountryChange}
          >
             <MenuItem value="worldWide">WorldWide</MenuItem>
            {
              countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }

          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default App;
