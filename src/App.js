import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  FormGroup,
  FormControlLabel,
  Switch,
  withStyles,
} from "@material-ui/core";
import { cyan, blueGrey } from "@material-ui/core/colors";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import {
  sortDataCases,
  sortDataRecovered,
  sortDataDeaths,
} from "./utils/sortData";
import { motion } from "framer-motion";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";
import { prettyPrint } from "./utils/prettyPrint";
import CovidLogo from "./components/Avatar";

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
  const [darkMode, setDarkMode] = useState(false);

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
  }, [mapCountries, value]);

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

  const PurpleSwitch = withStyles({
    switchBase: {
      color: blueGrey[300],
      "&$checked": {
        color: cyan[500],
      },
      "&$checked + $track": {
        backgroundColor: cyan[500],
      },
    },
    checked: {},
    track: {},
  })(Switch);

  const handleChange = (event) => {
    //* setting the state to dark mode
    // console.log(event.target.checked);
    return setDarkMode(event.target.checked);
  };

  const applyDarkMode = darkMode ? "white" : "black";

  return (
    <div className={`app ${darkMode && "app__dark"}`}>
      <motion.div
        initial={{
          x: -600,
          opacity: 0.4,
        }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            duration: 1.5,
            ease: "easeInOut",
          },
        }}
        className="app__left"
      >
        <div className="app__header">
          <div className="app__logo">
            <CovidLogo darkMode={darkMode}></CovidLogo>
          </div>

          <div className="app__header__content">
            <h1 style={{ color: `${applyDarkMode}` }}>Covid19 Tracker</h1>
            <FormGroup>
              <FormControlLabel
                control={
                  <PurpleSwitch
                    checked={darkMode}
                    onChange={handleChange}
                    name="toggler"
                  />
                }
                labelPlacement="start"
                label="Dark Mode"
              />
            </FormGroup>
            <FormControl
              className="app__dropdown"
              style={{
                backgroundColor: `${darkMode ? "black" : "white"}`,
                border: `${darkMode ? "2px solid white" : "None"}`,
              }}
            >
              <InputLabel
                id="label"
                style={{
                  color: `${applyDarkMode}`,
                  fontSize: "20px",
                }}
              >
                Country
              </InputLabel>
              <Select
                className="dropdown"
                labelId="label"
                id="select"
                variant="outlined"
                value={country}
                style={{
                  color: `${applyDarkMode}`,
                  width: "150px",
                }}
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
        </div>
        <div className="app__stats">
          <InfoBox
            darkMode={darkMode}
            color="red"
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrint(countryInfo.todayCases)}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            darkMode={darkMode}
            color="green"
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrint(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            darkMode={darkMode}
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
      </motion.div>
      <motion.Card
        className="app__right"
        initial={{
          x: 300,
          opacity: 0.4,
        }}
        animate={{
          x: 0,
          opacity: 1,
          transition: {
            duration: 1.5,
            ease: "easeInOut",
          },
        }}
      >
        <CardContent
          className="card-content"
          style={{
            backgroundColor: `${darkMode ? "#545352" : "white"}`,
            border: `${darkMode ? "2px solid black" : "None"}`,
          }}
        >
          <div className="table__header">
            <h3 style={{ color: `${applyDarkMode}` }}>Live cases by country</h3>
            <FormControl>
              <InputLabel id="demo-controlled-open-select-label">
                <strong style={{ color: `${applyDarkMode}` }}>Sort By</strong>
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={value}
                style={{
                  color: `${applyDarkMode}`,
                }}
                onChange={(e) => setValue(e.target.value)}
              >
                <MenuItem value="cases">cases</MenuItem>
                <MenuItem value="recovered">recovered</MenuItem>
                <MenuItem value="deaths">deaths</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Table
            countries={tableData}
            types={value}
            darkMode={darkMode}
          ></Table>
          <h3
            style={{
              color: `${applyDarkMode}`,
              margin: "50px 0px",
            }}
          >
            {country} {casesType} graph
          </h3>
          <LineGraph
            darkMode={darkMode}
            selected={casesType}
            className="app_graph"
            casesType={casesType}
          ></LineGraph>
        </CardContent>
      </motion.Card>
    </div>
  );
};

export default App;
