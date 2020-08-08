import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
const options = {
  legend: {
    display: false,
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
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = () => {
  const [data, setData] = useState({});

  const buildChartData = (data, casesType = "cases") => {
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

  //* Link: https://disease.sh/v3/covid-19/historical/all?lastdays=120

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((res) => res.json())
        .then((data) => {
          const chartData = buildChartData(data, "cases");
          setData(chartData);
        });
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>I am a graph</h1>
      {/* you can also use data?.length (equivalent to)-> data && data.length */}
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(201,16,52,0.5)",
                borderColor: "#CC1034",
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
