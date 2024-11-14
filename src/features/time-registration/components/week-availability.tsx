import { ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

import type {
  Availability,
  TimeSlot,
  WeekAvailabilityTableProps,
  WeekDays,
} from '../types/availability';
import {
  convertTimeStringToDecimal,
  generateCustomTimeIntervals,
} from '../utils/custom-time-intervals';

const initialAvailability: Availability = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
};

// eg: { Monday: ['08:00 - 08:10', '08:20 - 08:30'], Tuesday: ['08:00 - 08:10'] }
// const formatAvailability = (
//   availability: Availability,
// ): Partial<Record<WeekDays, { notEarlier: string; notLater: string }>> => {
//   const formattedAvailability: Partial<
//     Record<WeekDays, { notEarlier: string; notLater: string }>
//   > = {};

//   Object.keys(availability).forEach((day) => {
//     const dayAvailability = availability[day as WeekDays];
//     if (dayAvailability.length > 0) {
//       dayAvailability.sort((a, b) => {
//         const [hourA, minuteA] = a.split(' - ')[0].split(':').map(Number);
//         const [hourB, minuteB] = b.split(' - ')[0].split(':').map(Number);
//         return hourA - hourB || minuteA - minuteB;
//       });

//       const firstTime = dayAvailability[0].split(' - ')[0];
//       const lastTime =
//         dayAvailability[dayAvailability.length - 1].split(' - ')[1];

//       formattedAvailability[day as WeekDays] = {
//         notEarlier: firstTime,
//         notLater: lastTime,
//       };
//     }
//   });

//   return formattedAvailability;
// };

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

  return (
    <div className="container p-4">
      <div className="mb-2 flex justify-center md:hidden">
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          // Previous day
          onClick={() =>
            setVisibleDayIndex((prevIndex) => (prevIndex - 1 + 6) % 6)
          }
          disabled={visibleDayIndex === 0}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          // Next day
          onClick={() => setVisibleDayIndex((prevIndex) => (prevIndex + 1) % 6)}
          disabled={
            visibleDayIndex === Object.keys(initialAvailability).length - 1
          }
        >
          <ArrowRight size={24} />
        </button>
      </div>

      <div className="relative overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full table-fixed border border-gray-300">
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
                      className={`cursor-pointer select-none border p-0 transition duration-300 border-y-dashed ${
                        index !== visibleDayIndex ? 'hidden md:table-cell' : ''
                      } ${
                        availability[day as WeekDays].includes(interval)
                          ? 'border-y-blue-500'
                          : ''
                      } `}
                    >
                      <button
                        className={`size-full p-2 ${
                          availability[day as WeekDays].includes(interval)
                            ? 'bg-blue-500 text-white'
                            : 'hover:bg-blue-100'
                        }`}
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
        </div>
      </div>
    </div>
  );
};
