const segragateResponseResults = (responsesResult) => {
  const [successResults, errorResults] = [[], []];

  responsesResult.forEach((responseResult) => {
    if (responseResult.running === "Yes") {
      successResults.push(responseResult);
    } else {
      errorResults.push(responseResult);
    }
  });

  return {
    successResults,
    errorResults,
  };
};

module.exports = {
  segragateResponseResults,
};
