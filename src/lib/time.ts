import { AvailabilityDay } from "./user";

export const intToDay = (numOfWeek: number): string => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const normalizedIndex = ((numOfWeek % 7) + 7) % 7;
  return daysOfWeek[normalizedIndex];
};

export const intToTime = (timeInt: number): string => {
  if (!Number.isInteger(timeInt)) {
    return "";
  }
  const hour = Math.floor(timeInt / 100);
  const minute = timeInt % 100;
  const period = hour < 12 ? "am" : "pm";
  const formattedHour = hour % 12 || 12;
  const formattedHourString = formattedHour.toString().padStart(2, "0");
  const formattedMinuteString = minute.toString().padStart(2, "0");
  return `${formattedHourString}:${formattedMinuteString}${period}`;
};

export const addOneHour = (time: number): number => {
  const hours = Math.floor(time / 100);
  const minutes = time % 100;
  let newHours = hours + 1;
  const newMinutes = minutes;
  if (newHours >= 24) {
    newHours -= 24;
  }
  const newTime = newHours * 100 + newMinutes;
  return newTime;
};

export const strTimeToInt = (timeStr: string): number => {
  const cleanTimeString = timeStr.replace(/(am|pm)/i, "").trim();
  const [hours, minutes] = cleanTimeString.split(":").map(Number);
  let convertedHours = hours;
  if (timeStr.toLowerCase().includes("pm") && hours !== 12) {
    convertedHours = hours + 12;
  }
  if (timeStr.toLowerCase().includes("am") && hours === 12) {
    convertedHours = 0; // Midnight case
  }
  const timeInt = convertedHours * 100 + minutes;
  return timeInt;
};

export const getFormattedSchedule = (days?: AvailabilityDay[] | null): string[] => {
  if (!days) return [];
  const result: string[] = [];
  const enabledDays = days.filter((day) => day.enabled);
  const groupedTimes: { [key: string]: number[] } = {};
  for (const day of enabledDays) {
    const times = [`${intToTime(day.start_time)} - ${intToTime(day.end_time)}`];
    if (day.extend_times) {
      for (const extend of day.extend_times) {
        times.push(`${intToTime(extend.start_time)} - ${intToTime(extend.end_time)}`);
      }
    }
    const formattedTimes = times.join(", ");
    if (!groupedTimes[formattedTimes]) {
      groupedTimes[formattedTimes] = [];
    }
    groupedTimes[formattedTimes].push(day.day);
  }
  for (const times in groupedTimes) {
    const dayRange = groupedTimes[times];
    let dayString;
    if (dayRange.length > 1) {
      dayString = `${intToDay(dayRange[0])} - ${intToDay(dayRange[dayRange.length - 1])}`;
    } else {
      dayString = intToDay(dayRange[0]);
    }
    result.push(`${dayString}, ${times}`);
  }
  return result;
};

export const getMonthEndTimes = (month: number, year: number) => {
  let prevMonth = month - 1;
  let prevMonthYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevMonthYear -= 1;
  }
  const lastDayPrevMonth = new Date(prevMonthYear, prevMonth, 0);
  const lastDayCurrMonth = new Date(year, month, 0);
  const formatDate = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  return {
    endOfPrevMonth: formatDate(lastDayPrevMonth),
    endOfCurrMonth: formatDate(lastDayCurrMonth)
  };
}

export const convertToTimeFormats = (timeString: string) => {
  const date = new Date(timeString);
  const hours24 = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? "pm" : "am";
  const time12 = `${hours12}:${minutes.toString().padStart(2, "0")}${ampm}`;
  const time24 = `${hours24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  return { "12": time12, "24": time24, "full": timeString };
}
