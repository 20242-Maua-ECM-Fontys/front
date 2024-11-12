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
  Monday: TimeSlot[];
  Tuesday: TimeSlot[];
  Wednesday: TimeSlot[];
  Thursday: TimeSlot[];
  Friday: TimeSlot[];
  Saturday: TimeSlot[];
}

interface WeekAvailabilityTableProps {
  startHour: string;
  endHour: string;
  resetAvailability?: boolean;
}

const initialAvailability: Availability = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

const convertTimeStringToDecimal = (timeString: string): number => {
  const [hour, minute] = timeString.split(':').map(Number);
  return hour + minute / 60;
};

const convertDecimalToTimeString = (hourDecimal: number): string => {
  const hour = Math.floor(hourDecimal);
  const minute = Math.round((hourDecimal - hour) * 60);
  if (minute === 60) {
    return `${String(hour + 1).padStart(2, '0')}:00`;
  }
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

// Array of time intervals between startHour and endHour
// eg: generateCustomTimeIntervals(8, 18) => ['08:00 - 08:10', '08:10 - 08:20', ...]
const generateCustomTimeIntervals = (startHour: number, endHour: number) => {
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

// eg: { Monday: ['08:00 - 08:10', '08:20 - 08:30'], Tuesday: ['08:00 - 08:10'] }
const formatAvailability = (
  availability: Availability,
): Partial<Record<WeekDays, { notEarlier: string; notLater: string }>> => {
  const formattedAvailability: Partial<
    Record<WeekDays, { notEarlier: string; notLater: string }>
  > = {};

  Object.keys(availability).forEach((day) => {
    const dayAvailability = availability[day as WeekDays];
    if (dayAvailability.length > 0) {
      dayAvailability.sort((a, b) => {
        const [hourA, minuteA] = a.split(' - ')[0].split(':').map(Number);
        const [hourB, minuteB] = b.split(' - ')[0].split(':').map(Number);
        return hourA - hourB || minuteA - minuteB;
      });

      const firstTime = dayAvailability[0].split(' - ')[0];
      const lastTime =
        dayAvailability[dayAvailability.length - 1].split(' - ')[1];

      formattedAvailability[day as WeekDays] = {
        notEarlier: firstTime,
        notLater: lastTime,
      };
    }
  });

  return formattedAvailability;
};

export const WeekAvailabilityTable = ({
  startHour,
  endHour,
}: WeekAvailabilityTableProps) => {
  const [availability, setAvailability] =
    useState<Availability>(initialAvailability);
  const [visibleDayIndex, setVisibleDayIndex] = useState<number>(0);

  const startHourDecimal = convertTimeStringToDecimal(startHour);
  const endHourDecimal = convertTimeStringToDecimal(endHour);

  const timeIntervals = generateCustomTimeIntervals(
    startHourDecimal,
    endHourDecimal,
  );

  const toggleTimeSlot = (day: WeekDays, timeSlot: TimeSlot) => {
    setAvailability((prevAvailability) => {
      const dayAvailability = prevAvailability[day];
      const newDayAvailability = dayAvailability.includes(timeSlot)
        ? dayAvailability.filter((slot) => slot !== timeSlot)
        : [...dayAvailability, timeSlot];
      return { ...prevAvailability, [day]: newDayAvailability };
    });
  };

  const handleNextDay = () => {
    setVisibleDayIndex((prevIndex) => (prevIndex + 1) % 6);
  };

  const handlePreviousDay = () => {
    setVisibleDayIndex((prevIndex) => (prevIndex - 1 + 6) % 6);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2 flex justify-center md:hidden">
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          onClick={handlePreviousDay}
          disabled={visibleDayIndex === 0}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
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
                      className={`w-40 cursor-pointer select-none border transition duration-300 ${
                        index !== visibleDayIndex ? 'hidden md:table-cell' : ''
                      } ${
                        availability[day as WeekDays].includes(interval)
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-blue-100'
                      }`}
                    >
                      <button
                        className={'size-full'}
                        onClick={() =>
                          toggleTimeSlot(day as WeekDays, interval)
                        }
                      >
                        &nbsp;
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* <pre>{JSON.stringify(formatAvailability(availability), null, 2)}</pre> */}
        </div>
      </div>
    </div>
  );
};
