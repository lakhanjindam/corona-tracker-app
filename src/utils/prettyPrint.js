import numeral from "numeral";
export const prettyPrint = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
};
