import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
const InfoBox = ({ title, cases, total }) => {
  return (
    <Card className="Infobox">
      <CardContent>
        {/*Corona virus title */}
        <Typography className="Infobox__title" color="textSecondary">
          {title}
        </Typography>
        <h2>{cases}</h2>
        <Typography className="Infobox__total" color="textSecondary">
          {total} Total
        </Typography>
        {/*Corona virus total */}
      </CardContent>
    </Card>
  );
};

export default InfoBox;
