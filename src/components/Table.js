import React from "react";
import "./css/Table.css";
import numeral from "numeral";

const Table = ({ countries, types }) => {
  //* Sort the table by deaths, cases and recovered for all country
  return (
    <div className="table">
      {types === "cases"
        ? countries.map(({ country, cases }) => {
            return (
              <tr>
                <td>{country}</td>
                <td>
                  <strong>{numeral(cases).format("0,0")}</strong>
                </td>
              </tr>
            );
          })
        : types === "recovered"
        ? countries.map(({ country, recovered }) => {
            return (
              <tr>
                <td>{country}</td>
                <td>
                  <strong>{numeral(recovered).format("0,0")}</strong>
                </td>
              </tr>
            );
          })
        : countries.map(({ country, deaths }) => {
            return (
              <tr>
                <td>{country}</td>
                <td>
                  <strong>{numeral(deaths).format("0,0")}</strong>
                </td>
              </tr>
            );
          })}
    </div>
  );
};

export default Table;
