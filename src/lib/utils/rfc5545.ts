import { RRule, datetime } from "rrule";

export const parseRecurrence = (recurrences: string[]): RRule | null => {
  if (recurrences.length === 0) return null;
  const rfcString = recurrences.join("\n");
  return RRule.fromString(rfcString);
};

export const toDatetime = (date: Date): Date => {
  return datetime(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  );
};
