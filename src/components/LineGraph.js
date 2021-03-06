import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const buildChartData = (data, casesType) => {
  const chartData = [];
  let lastDataPoint;
  Object.entries(data[casesType]).forEach((dates) => {
    const date = dates[0];
    const value = dates[1];
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: value - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }

    lastDataPoint = value;
  });
  return chartData;
};

const LineGraph = ({ casesType, ...props }) => {
  const [data, setData] = useState({});

  const options = {
    legend: {
      display: true,
      position: "top",
      labels: {
        fontColor: `${props.darkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}`,
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            //* Dont show the grid lines of y axis
            display: true,
          },
          ticks: {
            fontColor: `${
              props.darkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
            }`,
          },
          type: "time",
          time: {
            //* format in which you wanna display the data
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            //* Dont show the grid lines of y axis
            display: true,
          },
          ticks: {
            fontColor: `${
              props.darkMode ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
            }`,
            // Include a dollar sign in the ticks
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };

  //* Link: https://disease.sh/v3/covid-19/historical/all?lastdays=120

  //!add dependency for useEffect which is casesTypes
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className} style={{ margin: "5px 0px" }}>
      {/* you can also use data?.length (equivalent to)-> data && data.length */}
      {data?.length > 0 && (
        <Line
          backgroundColor="#000"
          options={options}
          data={{
            datasets: [
              {
                label: `${
                  props.selected === "recovered"
                    ? "recovered"
                    : props.selected === "deaths"
                    ? "deaths"
                    : "cases"
                }`,
                backgroundColor: `${
                  props.selected === "recovered"
                    ? "rgba(91, 235, 52,0.5)"
                    : "rgba(201,16,52,0.5)"
                }`,
                borderColor: `${
                  props.selected === "recovered" ? "#5beb34 " : "#CC1034"
                }`,
                data: data,
              },
            ],
          }}
        ></Line>
      )}
    </div>
  );
};

export default LineGraph;
