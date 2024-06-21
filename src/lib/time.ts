export const intToDay = (numOfWeek: number): string => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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
