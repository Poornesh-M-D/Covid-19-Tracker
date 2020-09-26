import React ,{useEffect, useState}from 'react';
import './App.css';
import { MenuItem, Card, CardContent} from '@material-ui/core/';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Map from './Map.js';
import InfoBox from "./InfoBox.js";
import Table from './Table';
import {sortData,prettyPrintStat} from './util';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries]=useState([]);
  const [country,setCountry]=useState(['worldwide']);
  const [ countryInfo, setCountryInfo]= useState([]);
  const [tableData,setTableData]=useState([]);
  const[mapCenter,setMapCenter]=useState({lat:34.80746,lng: -40.479 });
  const[mapZoom,setMapZoom]=useState(3);
  const[mapCountries,setMapCountries]=useState([]);
  const[casesType,setCasesType]=useState("cases");
  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response)=> response.json())
    .then((data) =>{
      setCountryInfo(data);
    })
  }, [] )

  useEffect(()=>{
        const getCountriesData = async () => {
          await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response)=> response.json())
          .then((data) => {
            const countries = data.map(
              (country) => ({
                "countryName":country.country,
                "countryCode":country.countryInfo.iso2
              }));
              const sortedData=sortData(data);
              setMapCountries(data);
            setTableData(sortedData);
            setCountries(countries);
          });
        };
        getCountriesData();
  }, [] );


  
  const onCountryChange= async (event) =>{
    const countryCode=event.target.value;
    setCountry(countryCode); 

    const url =
    countryCode==="worldwide"
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
      .then(response => response.json())
      .then(data =>{
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
        setMapZoom(4);
      })
  };
  return (
    <div className="App">
      <div className="App__left">
      <div className="app__header">
      <h1>Covid-19 Tracker</h1>
      <FormControl className="dropdown_menu">
        <Select variant="outlined" 
          value={country} onChange={onCountryChange}
        >
          <MenuItem value='worldwide'>Worldwide</MenuItem>
          {countries.map((country)=> (
            <MenuItem value={country.countryCode}>{country.countryName}</MenuItem>
          ))}

        </Select>
      </FormControl>
      </div>

      <div className="App__stats">
      <InfoBox isRed active={casesType === "cases"} onClick={e => setCasesType('cases')} title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
        <InfoBox  active={casesType === "recovered"} onClick={e => setCasesType('recovered')} title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
        <InfoBox isRed  active={casesType === "deaths"} onClick={e => setCasesType('deaths')} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>
      </div>
          
      <Map 
      casesType={casesType}
      countries={mapCountries}

      center={mapCenter}
      zoom={mapZoom}/>
      </div>
      
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
            <Table countries={tableData}/>
          <h3>WorldWide New cases</h3>
          <img  src="https://w.ndtvimg.com/sites/3/2020/07/15154130/decline_in_coronavirus_death_rate_in_india_istock_660x330.jpg"/>
        </CardContent>

      </Card>

    </div> 
  );
}


export default App;
