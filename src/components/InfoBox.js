import React from "react";
import "./css/InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";
import numeral from "numeral";
import { motion } from "framer-motion";

const InfoBox = ({ title, cases, total, ...props }) => {
  return (
    <motion.Card
      whileHover={{
        scale: 1.03,
      }}
      onClick={props.onClick}
      className="Infobox"
      style={{
        backgroundColor: `${props.darkMode ? "black" : "white"}`,
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
            color: `${
              props.active
                ? `${props.color}`
                : props.darkMode
                ? "white"
                : "black"
            }`,
          }}
        >
          {title}
        </Typography>

        <h2
          className="Infobox__cases"
          style={{
            color: `${
              props.active
                ? `${props.color}`
                : props.darkMode
                ? "white"
                : "black"
            }`,
          }}
        >
          {cases}
        </h2>
        <Typography
          className="Infobox__total"
          color={`${props.darkMode ? "secondary" : "textPrimary"}`}
        >
          <strong>Total: </strong>
          {numeral(total).format("0,0")}
        </Typography>
        {/*Corona virus total */}
      </CardContent>
    </motion.Card>
  );
};

export default InfoBox;
