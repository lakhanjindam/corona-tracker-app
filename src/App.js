import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import {
  sortDataCases,
  sortDataRecovered,
  sortDataDeaths,
} from "./utils/sortData";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrint } from "./utils/prettyPrint";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [value, setValue] = useState("cases");

  //* For initial state get worldwide data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  //*Link: https://disease.sh/v3/covid-19/countries
  //*It loads once when the component is loaded and not again
  //*now by adding dependency as countries it loads every time when countries state will change

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => {
            return {
              name: country.country,
              value: country.countryInfo.iso2, //*USA, UK
            };
          });
          const sortedData = sortDataCases(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  useEffect(() => {
    const onChangeData = () => {
      let sortedData;
      if (value === "recovered") {
        sortedData = sortDataRecovered(mapCountries);
      } else if (value === "deaths") {
        sortedData = sortDataDeaths(mapCountries);
      } else {
        sortedData = sortDataCases(mapCountries);
      }
      setTableData(sortedData);
      console.log(sortedData);
    };

    onChangeData();
  }, [value]);

  //*change the select text based on country selected
  const changeCountry = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "Worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        //data contains all the info about the countries
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid19 tracker app</h1>
          <FormControl className="app__dropdown" style={{}}>
            <InputLabel id="label" style={{ fontSize: "20px" }}>
              Country
            </InputLabel>
            <Select
              labelId="label"
              id="select"
              variant="outlined"
              value={country}
              style={{ width: "150px" }}
              onChange={changeCountry}
            >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {countries.map((country, key) => {
                return (
                  <MenuItem key={key} value={country.value}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            color="red"
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrint(countryInfo.todayCases)}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            color="green"
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrint(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            color="red"
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrint(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>
        <Map
          countries={mapCountries}
          casesTypes={casesType}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
      </div>
      <Card className="app_right">
        <CardContent className="card-content">
          <div className="table__header">
            <h3>Live cases by country</h3>
            <FormControl>
              <InputLabel id="demo-controlled-open-select-label">
                <strong>Sort By</strong>
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <MenuItem value="cases">cases</MenuItem>
                <MenuItem value="recovered">recovered</MenuItem>
                <MenuItem value="deaths">deaths</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Table countries={tableData} types={value}></Table>
          <h3 style={{ margin: "50px 0px" }}>
            {country} {casesType} graph
          </h3>
          <LineGraph
            selected={casesType}
            className="app_graph"
            casesType={casesType}
          ></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
