import React from "react";
import "./css/InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
const InfoBox = ({ title, cases, total, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className="Infobox"
      style={{
        borderTop: `${
          props.active
            ? `10px solid ${props.color === "green" ? "greenyellow" : "red"}`
            : "None"
        }`,
      }}
    >
      <CardContent className="info-content">
        {/*Corona virus title */}
        <Typography
          className="Infobox__title"
          color="textSecondary"
          style={{
            color: `${props.active ? `${props.color}` : "None"}`,
          }}
        >
          {title}
        </Typography>

        <h2
          className="Infobox__cases"
          style={{
            color: `${props.active ? `${props.color}` : "None"}`,
          }}
        >
          {cases}
        </h2>
        <Typography className="Infobox__total" color="textSecondary">
          {total} Total
        </Typography>
        {/*Corona virus total */}
      </CardContent>
    </Card>
  );
};

export default InfoBox;
