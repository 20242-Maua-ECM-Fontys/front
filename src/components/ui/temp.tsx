
import { ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

import type { Availability } from '@/types/api';

type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

interface WeekAvailabilityTableProps {
  startHour: string;
  endHour: string;
  initialAvailability: Availability[];
  userId: number | string | undefined;
  availability: Availability[];
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
  const intervalDuration = 100 / 60; // 100 minutes in decimal hours
  const skipStart1 = 16 + 50 / 60; // 16:50 in decimal hours
  const skipEnd1 = 18 + 30 / 60; // 18:30 in decimal hours
  const resumeStart1 = 19; // 19:00 in decimal hours
  const skipStart2 = 20 + 50 / 60; // 20:50 in decimal hours
  const skipEnd2 = 22 + 30 / 60; // 22:30 in decimal hours

  while (currentHour < endHour) {
    if (currentHour >= skipStart1 && currentHour < skipEnd1) {
      timeIntervals.push('16:50 - 18:30');
      currentHour = resumeStart1;
    } else if (currentHour >= skipStart2 && currentHour < skipEnd2) {
      timeIntervals.push('20:50 - 22:30');
      currentHour = skipEnd2;
    } else {
      const startTime = convertDecimalHourToTimeString(currentHour);
      let endHourInterval = currentHour + intervalDuration;
      if (endHourInterval > endHour) {
        endHourInterval = endHour;
      }
      const endTime = convertDecimalHourToTimeString(endHourInterval);

      timeIntervals.push(`${startTime} - ${endTime}`);
      currentHour = endHourInterval + 10 / 60; // Add a 10-minute interval
    }
  }

  return timeIntervals;
};

// Função para converter o tempo em minutos
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const WeekAvailabilityTable: React.FC<WeekAvailabilityTableProps> = ({
                                                                              startHour,
                                                                              endHour,
                                                                              initialAvailability,
                                                                            }) => {
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);

  const startHourDecimal = convertTimeStringToDecimal(startHour);
  const endHourDecimal = convertTimeStringToDecimal(endHour);
  const [availability, setAvailability] =
    useState<Availability[]>(initialAvailability);

  const timeIntervals = generateCustomTimeIntervals(
    startHourDecimal,
    endHourDecimal,
  );

  const toggleTimeSlot = (day: WeekDays, interval: string) => {
    const [startTimeStr, endTimeStr] = interval.split(' - ');
    const weekDay = day.slice(0, 3).toUpperCase(); // Abreviação do dia (e.g., MON)

    const startTime = convertTimeToMinutes(startTimeStr);
    const endTime = convertTimeToMinutes(endTimeStr);

    if (setAvailability) {
      setAvailability((prev) => {
        const existingSlotIndex = prev.findIndex(
          (slot) =>
            slot.startTime === startTime &&
            slot.endTime === endTime &&
            slot.weekDay === weekDay,
        );

        let updatedAvailability;
        if (existingSlotIndex >= 0) {
          // Remove o slot de tempo se já existir
          updatedAvailability = prev.filter(
            (_, index) => index !== existingSlotIndex,
          );
        } else {
          // Adiciona o novo slot de tempo
          updatedAvailability = [...prev, { startTime, endTime, weekDay }];
        }

        return updatedAvailability;
      });
    }
  };

  const handleNextDay = () => {
    if (visibleDayIndex < 5) {
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
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          onClick={handlePreviousDay}
          disabled={visibleDayIndex === 0}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          onClick={handleNextDay}
          disabled={visibleDayIndex === 5}
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
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ].map((day, index) => (
                <th
                  key={day}
                  className={`border-b-2 p-2 text-center text-sm md:text-base ${index !== visibleDayIndex ? 'hidden md:table-cell' : ''}`}
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
                {[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((day, index) => (
                  <td
                    key={day + interval}
                    className={`h-12 cursor-pointer border p-0 text-sm transition ${index !== visibleDayIndex ? 'hidden md:table-cell' : ''}`}
                  >
                    <button
                      className={`size-full p-2 ${availability.some((slot) => slot.startTime === convertTimeToMinutes(convertDecimalHourToTimeString(convertTimeStringToDecimal(interval.split('-')[0]))) && slot.endTime === convertTimeToMinutes(convertDecimalHourToTimeString(convertTimeStringToDecimal(interval.split('-')[1]))) && slot.weekDay === day.slice(0, 3).toUpperCase()) ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                      onClick={() =>
                        toggleTimeSlot(day as WeekDays, interval)
                      }
                    ></button>
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


import { ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

import type { Availability } from '@/types/api';

type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

interface WeekAvailabilityTableProps {
  startHour: string;
  endHour: string;
  initialAvailability: Availability[];
  userId: number | string | undefined;
  setAvailability: React.Dispatch<React.SetStateAction<Availability[]>>; // Added this line
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
  const intervalDuration = 100 / 60; // 100 minutes in decimal hours
  const skipStart1 = 16 + 50 / 60; // 16:50 in decimal hours
  const skipEnd1 = 18 + 30 / 60; // 18:30 in decimal hours
  const resumeStart1 = 19; // 19:00 in decimal hours
  const skipStart2 = 20 + 50 / 60; // 20:50 in decimal hours
  const skipEnd2 = 22 + 30 / 60; // 22:30 in decimal hours

  while (currentHour < endHour) {
    if (currentHour >= skipStart1 && currentHour < skipEnd1) {
      timeIntervals.push('16:50 - 18:30');
      currentHour = resumeStart1;
    } else if (currentHour >= skipStart2 && currentHour < skipEnd2) {
      timeIntervals.push('20:50 - 22:30');
      currentHour = skipEnd2;
    } else {
      const startTime = convertDecimalHourToTimeString(currentHour);
      let endHourInterval = currentHour + intervalDuration;
      if (endHourInterval > endHour) {
        endHourInterval = endHour;
      }
      const endTime = convertDecimalHourToTimeString(endHourInterval);

      timeIntervals.push(`${startTime} - ${endTime}`);
      currentHour = endHourInterval + 10 / 60; // Add a 10-minute interval
    }
  }

  return timeIntervals;
};

// Função para converter o tempo em minutos
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const WeekAvailabilityTable: React.FC<WeekAvailabilityTableProps> = ({
                                                                              startHour,
                                                                              endHour,
                                                                              initialAvailability,
                                                                              setAvailability,
                                                                            }) => {
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);

  const startHourDecimal = convertTimeStringToDecimal(startHour);
  const endHourDecimal = convertTimeStringToDecimal(endHour);
  const [availability, setLocalAvailability] =
    useState<Availability[]>(initialAvailability);
  const timeIntervals = generateCustomTimeIntervals(
    startHourDecimal,
    endHourDecimal,
  );


  const toggleTimeSlot = (day: WeekDays, interval: string) => {
    const [startTimeStr, endTimeStr] = interval.split(' - ');
    const weekDay = day.slice(0, 3).toUpperCase(); // Abreviação do dia (e.g., MON)

    const startTime = convertTimeToMinutes(startTimeStr);
    const endTime = convertTimeToMinutes(endTimeStr);

    setLocalAvailability((prev) => {
      const existingSlotIndex = prev.findIndex(
        (slot) =>
          slot.startTime === startTime &&
          slot.endTime === endTime &&
          slot.weekDay === weekDay
      );

      let updatedAvailability;
      if (existingSlotIndex >= 0) {
        // Remove o slot de tempo se já existir
        updatedAvailability = prev.filter(
          (_, index) => index !== existingSlotIndex,
        );
      } else {
        // Adiciona o novo slot de tempo
        updatedAvailability = [...prev, { startTime, endTime, weekDay }];
      }

      setAvailability(updatedAvailability); // Propagate changes to parent
      return updatedAvailability;
    });
  }

  const handleNextDay = () => {
    if (visibleDayIndex < 5) {
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
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          onClick={handlePreviousDay}
          disabled={visibleDayIndex === 0}
        >
          <ArrowLeft size={24} />
        </button>
        <button
          className="mx-1 p-2 text-blue-500 hover:text-blue-700 focus:outline-none disabled:opacity-50"
          onClick={handleNextDay}
          disabled={visibleDayIndex === 5}
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
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ].map((day, index) => (
                <th
                  key={day}
                  className={`border-b-2 p-2 text-center text-sm md:text-base ${index !== visibleDayIndex ? 'hidden md:table-cell' : ''}`}
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
                {[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((day, index) => (
                  <td
                    key={day + interval}
                    className={`h-12 cursor-pointer border p-0 text-sm transition ${index !== visibleDayIndex ? 'hidden md:table-cell' : ''}`}
                  >
                    <button
                      className={`size-full p-2 ${availability.some((slot) => slot.startTime === convertTimeToMinutes(convertDecimalHourToTimeString(convertTimeStringToDecimal(interval.split('-')[0]))) && slot.endTime === convertTimeToMinutes(convertDecimalHourToTimeString(convertTimeStringToDecimal(interval.split('-')[1]))) && slot.weekDay === day.slice(0, 3).toUpperCase()) ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}

                      onClick={() =>
                        toggleTimeSlot(day as WeekDays, interval)
                      }
                    ></button>
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
