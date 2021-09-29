import './App.css';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData, prettyPrintStat} from './util';
import {useState, useEffect} from 'react';
import {FormControl, MenuItem, Typography} from '@material-ui/core';
import { Card, CardContent } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [country,setCountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -65.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then((data) => {
      setCountryInfo(data);
    })
  }, []);

  useEffect(()=>{
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data)=>{
        const countris = data.map((country)=>(
          {
            name: country.country,
            value: country.countryInfo.iso2, 
          }
        ));
        const sortedData = sortData(data);
        setCountries(countris);
        setMapCountries(data);
        setTableData(sortedData);
      });
    };
    getCountriesData();
  },[]);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    const url = countryCode === 'worldwide' 
        ? 'https://disease.sh/v3/covid-19/all' 
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    const setCountryData = async() => {
      await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter({ lat:data.countryInfo.lat, lng:data.countryInfo.long});
        setMapZoom(4);
      });
    }
    setCountryData();
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <Typography variant="h4" component="h4" gutterBottom>
            COVID-19 TRACKER
          </Typography>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
            <InfoBox onClick={(e) => setCasesType('cases')} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}></InfoBox>
            <InfoBox onClick={(e) => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}></InfoBox>
            <InfoBox onClick={(e) => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}></InfoBox>
        </div>
        
        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>

      <Card className="app__right">
          <CardContent>
            <h3>Live Cases By Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new cases</h3>
            <LineGraph casesType={casesType} />
          </CardContent>
      </Card>
    </div>
  );
}

export default App;
