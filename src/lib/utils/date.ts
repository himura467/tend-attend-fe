import { z } from "zod";
import { tzOffset } from "@date-fns/tz";
import { TZDateMini } from "@date-fns/tz";

export const applyTimezone = (date: Date, timezone: string): Date => {
  return new TZDateMini(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    timezone,
  ).withTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
};

export const toISOStringWithTimezone = (date: Date, timezone: string): string => {
  const zonedDate = new TZDateMini(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ).withTimeZone(timezone);
  const year = zonedDate.getFullYear().toString().padStart(4, "0");
  const month = (zonedDate.getMonth() + 1).toString().padStart(2, "0");
  const day = zonedDate.getDate().toString().padStart(2, "0");
  const hour = zonedDate.getHours().toString().padStart(2, "0");
  const minute = zonedDate.getMinutes().toString().padStart(2, "0");
  const second = zonedDate.getSeconds().toString().padStart(2, "0");
  const utcDate = new Date(Date.UTC(1970));
  const diffFromUtc = tzOffset(timezone, utcDate);
  if (diffFromUtc === 0) {
    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  }
  const tzSign = diffFromUtc > 0 ? "+" : "-";
  const tzHour = Math.floor(Math.abs(diffFromUtc) / 60)
    .toString()
    .padStart(2, "0");
  const tzMinute = (Math.abs(diffFromUtc) % 60).toString().padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${tzSign}${tzHour}:${tzMinute}`;
};

const ymdDateSchema = z
  .date()
  .refine(
    (date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
      return hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0;
    },
    { message: "Date must only contain YYYY-MM-DD (time part must be 00:00:00.000)." },
  )
  .brand<"YmdDate">();
export type YmdDate = z.infer<typeof ymdDateSchema>;

const ymdHm15DateSchema = z
  .date()
  .refine(
    (date) => {
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const milliseconds = date.getMilliseconds();
      return [0, 15, 30, 45].includes(minutes) && seconds === 0 && milliseconds === 0;
    },
    { message: "Minutes must be 0, 15, 30, or 45, and seconds/milliseconds must be 0." },
  )
  .brand<"YmdHm15Date">();
export type YmdHm15Date = z.infer<typeof ymdHm15DateSchema>;

export const parseYmdDate = (date: Date | string): YmdDate => {
  if (date instanceof Date) {
    return ymdDateSchema.parse(date);
  }
  return ymdDateSchema.parse(new Date(date));
};

export const parseYmdHm15Date = (date: Date | string): YmdHm15Date => {
  if (date instanceof Date) {
    return ymdHm15DateSchema.parse(date);
  }
  return ymdHm15DateSchema.parse(new Date(date));
};

export const isYmdDate = (value: unknown): value is YmdDate => {
  return ymdDateSchema.safeParse(value).success;
};

export const getCurrentYmdDate = (date: Date | string): YmdDate => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  date.setHours(0, 0, 0, 0);
  return ymdDateSchema.parse(date);
};
