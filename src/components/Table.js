import React from "react";
import "./css/Table.css";
import numeral from "numeral";

const Table = ({ countries, types, darkMode }) => {
  //* Sort the table by deaths, cases and recovered for all country
  return (
    <div className="table">
      {types === "cases"
        ? countries.map(({ country, cases }) => {
            return (
              <tr className={`${darkMode && "table__dark"}`}>
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
              <tr className={`${darkMode && "table__dark"}`}>
                <td>{country}</td>
                <td>
                  <strong>{numeral(recovered).format("0,0")}</strong>
                </td>
              </tr>
            );
          })
        : countries.map(({ country, deaths }) => {
            return (
              <tr className={`${darkMode && "table__dark"}`}>
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
