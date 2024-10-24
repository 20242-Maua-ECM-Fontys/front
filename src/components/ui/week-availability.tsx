import { ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';
type TimeSlot = string;

interface Availability {
  Monday?: TimeSlot[];
  Tuesday?: TimeSlot[];
  Wednesday?: TimeSlot[];
  Thursday?: TimeSlot[];
  Friday?: TimeSlot[];
  Saturday?: TimeSlot[];
}

interface WeekAvailabilityTableProps {
  startHour: string;
  endHour: string;
  resetAvailability?: boolean;
}

const convertTimeStringToDecimal = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour + minute / 60;
};

const convertDecimalHourToTimeString = (hourDecimal: number): string => {
  const hour = Math.floor(hourDecimal);
  const minute = Math.round((hourDecimal - hour) * 60);
  if (minute === 60) {
    return `${String(hour + 1).padStart(2, '0')}:00`;
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

const generateCustomTimeIntervals = (startHour: number, endHour: number) => {
  const timeIntervals: string[] = [];
  let currentHour = startHour;
  const intervalDuration = 100 / 60;

  while (currentHour < endHour) {
    const startTime = convertDecimalHourToTimeString(currentHour);
    let endHourInterval = currentHour + intervalDuration;
    if (endHourInterval > endHour) {
      endHourInterval = endHour;
    }
    const endTime = convertDecimalHourToTimeString(endHourInterval);

    timeIntervals.push(`${startTime} - ${endTime}`);
    currentHour = endHourInterval + 10 / 60;
  }

  return timeIntervals;
};

const initialAvailability: Availability = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const formatAvailability = (availability: Availability) => {
  const formattedAvailability: {
    [day: string]: { notEarlier: string; notLater: string };
  } = {};

  // order the time slots to be in ascending order
  for (const day in availability) {
    availability[day].sort((a, b) => {
      const [hourA, minuteA] = a.split(' - ')[0].split(':').map(Number);
      const [hourB, minuteB] = b.split(' - ')[0].split(':').map(Number);

      return hourA - hourB || minuteA - minuteB;
    });
  }

  for (const day in availability) {
    if (availability[day].length > 0) {
      // Extract the first and last time of the day
      const firstTime = availability[day][0].split(' - ')[0]; // catch the start time of the first interval
      const lastTime =
        availability[day][availability[day].length - 1].split(' - ')[1]; // catch the end time of the last interval

      // Format and store the availability
      formattedAvailability[day] = {
        notEarlier: firstTime.replace(':', 'h'), // format to HHhMM
        notLater: lastTime.replace(':', 'h'),
      };
    }
  }

  return formattedAvailability;
};

const WeekAvailabilityTable: React.FC<WeekAvailabilityTableProps> = ({
  startHour,
  endHour,
}) => {
  const [availability, setAvailability] =
    useState<Availability>(initialAvailability);
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);

  const startHourDecimal = convertTimeStringToDecimal(startHour);
  const endHourDecimal = convertTimeStringToDecimal(endHour);

  const timeIntervals = generateCustomTimeIntervals(
    startHourDecimal,
    endHourDecimal,
  );

  const toggleTimeSlot = (day: WeekDays, time: TimeSlot) => {
    setAvailability((prev) => {
      const dayAvailability = prev[day] || [];
      const isTimeSelected = dayAvailability.includes(time);

      return {
        ...prev,
        [day]: isTimeSelected
          ? dayAvailability.filter((t) => t !== time)
          : [...dayAvailability, time],
      };
    });
  };

  const handleNextDay = () => {
    if (visibleDayIndex < Object.keys(initialAvailability).length - 1) {
      setVisibleDayIndex(visibleDayIndex + 1);
    }
  };

  const handlePreviousDay = () => {
    if (visibleDayIndex > 0) {
      setVisibleDayIndex(visibleDayIndex - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2 flex justify-center md:hidden">
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50 "
          onClick={handlePreviousDay}
          disabled={visibleDayIndex === 0}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50 "
          onClick={handleNextDay}
          disabled={
            visibleDayIndex === Object.keys(initialAvailability).length - 1
          }
        >
          <ArrowRight size={24} />
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr>
                <th className="border-b-2 p-2 text-center text-sm md:text-base">
                  Time Intervals
                </th>
                {Object.keys(initialAvailability).map((day, index) => (
                  <th
                    key={day}
                    className={`border-b-2 p-2 text-center text-sm md:text-base ${
                      index !== visibleDayIndex ? 'hidden md:table-cell' : ''
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeIntervals.map((interval) => (
                <tr key={interval} className="text-center">
                  <td className="border bg-gray-100 p-2 text-sm md:text-base">
                    {interval}
                  </td>
                  {Object.keys(initialAvailability).map((day, index) => (
                    <td
                      key={day + interval}
                      className={`duration-600 cursor-pointer border p-2 text-sm transition md:text-base ${
                        index !== visibleDayIndex ? 'hidden md:table-cell' : ''
                      } ${
                        availability[day as WeekDays].includes(interval)
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-blue-100'
                      }`}
                      onClick={() => toggleTimeSlot(day as WeekDays, interval)}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <pre>{JSON.stringify(formatAvailability(availability), null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default WeekAvailabilityTable;
