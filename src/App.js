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
import { sortData } from "./utils/sortData";
import LineGraph from "./components/LineGraph";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

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
          const sortedData = sortData(data);
          setTableData(sortedData);
          console.log(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
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
        setCountry(countryCode);
        setCountryInfo(data);
        console.log(countryInfo);
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
            title="Coronavirus cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>
        <Map></Map>
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData}></Table>
          <h3>Worldwide new cases</h3>
          <LineGraph>I am a Line graph</LineGraph>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
