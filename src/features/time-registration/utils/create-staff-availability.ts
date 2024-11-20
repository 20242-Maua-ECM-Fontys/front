export const convertTimeStringToDecimal = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour + minute / 60;
};

export const convertDecimalToTimeString = (hourDecimal: number): string => {
  const hour = Math.floor(hourDecimal);
  const minute = Math.round((hourDecimal - hour) * 60);
  if (minute === 60) {
    return `${String(hour + 1).padStart(2, '0')}:00`;
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

// Array of time intervals between startHour and endHour
// eg: generateCustomTimeIntervals(8, 18) => ['08:00 - 08:10', '08:10 - 08:20', ...]
export const generateCustomTimeIntervals = (
  startHour: number,
  endHour: number,
) => {
  const timeIntervals: string[] = [];
  let currentHour = startHour;
  const intervalDuration = 100 / 60;

  while (currentHour < endHour) {
    const startTime = convertDecimalToTimeString(currentHour);
    let endHourInterval = currentHour + intervalDuration;
    if (endHourInterval > endHour) {
      endHourInterval = endHour;
    }
    const endTime = convertDecimalToTimeString(endHourInterval);

    timeIntervals.push(`${startTime} - ${endTime}`);
    currentHour = endHourInterval + 10 / 60;
  }

  return timeIntervals;
};
