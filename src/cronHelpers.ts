import cronParser from 'cron-parser';
import { BatchConfig } from './types';

interface CronFields {
  second: number[];
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
}

// https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
// date arg - Simple JS Date Object - new Date()
export const convertTimeZoneForDate = (date: Date | string, tzString: string): Date => {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString,
    })
  );
};

// https://github.com/harrisiirak/cron-parser/issues/153
export const isCurrentDateTimeMatchesWithCronExpression = (cronExpression: string, date: Date): boolean => {
  const interval = cronParser.parseExpression(cronExpression);
  const data = interval.fields as unknown as CronFields;

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

interface GetMonitoringBatchesParams {
  monitoringBatchesConfig: BatchConfig[];
  dateTime: Date;
}

export const getMonitoringBatchesWithCronMatchingDateTime = ({
  monitoringBatchesConfig,
  dateTime,
}: GetMonitoringBatchesParams): BatchConfig[] => {
  return monitoringBatchesConfig.filter(({ schedule }) =>
    isCurrentDateTimeMatchesWithCronExpression(schedule, dateTime)
  );
};
