export const sortDataCases = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.cases > b.cases) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const sortDataRecovered = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.recovered > b.recovered) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};

export const sortDataDeaths = (data) => {
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    if (a.deaths > b.deaths) {
      return -1;
    } else {
      return 1;
    }
  });
  return sortedData;
};
