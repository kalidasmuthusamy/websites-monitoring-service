const cronParser = require("cron-parser");

// https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
// date arg - Simple JS Date Object - new Date()
const convertTimeZoneForDate = (date, tzString) => {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
};

// https://github.com/harrisiirak/cron-parser/issues/153
const isCurrentDateTimeMatchesWithCronExpression = (cronExpression, date) => {
  var interval = cronParser.parseExpression(cronExpression);
  var data = interval.fields;

  if (!data.second.includes(date.getSeconds())) {
    return false;
  }
  if (!data.minute.includes(date.getMinutes())) {
    return false;
  }
  if (!data.hour.includes(date.getHours())) {
    return false;
  }
  if (!data.dayOfMonth.includes(date.getDate())) {
    return false;
  }
  if (!data.month.includes(date.getMonth() + 1)) {
    return false;
  }
  if (!data.dayOfWeek.includes(date.getDay())) {
    return false;
  }
  return true;
};

const getMonitoringBatchesConfiguredForCurrentDateTime = (
  monitoringBatchesConfig
) => {
  // Even if server running Node Process is outside India, consider Indian Time
  // As Cron is configured as per Indian Time Zone
  const currentDateTime = convertTimeZoneForDate(new Date(), "Asia/Kolkata");

  return monitoringBatchesConfig.filter(({ cronSchedule: batchCronSchedule }) =>
    isCurrentDateTimeMatchesWithCronExpression(
      batchCronSchedule,
      currentDateTime
    )
  );
};

module.exports = {
  getMonitoringBatchesConfiguredForCurrentDateTime,
};
