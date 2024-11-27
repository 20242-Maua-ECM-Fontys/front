import { ArrowRight, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

interface Availability {
  startTime: number; // em minutos
  endTime: number; // em minutos
  weekDay: string;
}

interface WeekAvailabilityTableProps {
  startHour: string;
  endHour: string;
  initialAvailability: Availability[];
  onAvailabilityChange: (newAvailability: Availability[]) => void; // Adicionei essa linha
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
    currentHour = endHourInterval + 10 / 60; // Adiciona um intervalo de 10 minutos
  }

  return timeIntervals;
};

// Função para converter o tempo em minutos
const convertTimeToMinutes = (time: number): number => {
  const hours = Math.floor(time);
  const minutes = Math.round((time - hours) * 60);
  return hours * 60 + minutes;
};

const WeekAvailabilityTable: React.FC<WeekAvailabilityTableProps> = ({
  startHour,
  endHour,
  initialAvailability, // Recebendo a lista de disponibilidade
  onAvailabilityChange, // Adicionando a função de callback
}) => {
  const [availability, setAvailability] =
    useState<Availability[]>(initialAvailability);
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);

  const startHourDecimal = convertTimeStringToDecimal(startHour);
  const endHourDecimal = convertTimeStringToDecimal(endHour);

  const timeIntervals = generateCustomTimeIntervals(
    startHourDecimal,
    endHourDecimal,
  );

  const toggleTimeSlot = (day: WeekDays, interval: string) => {
    const [startTimeStr, endTimeStr] = interval.split(' - ');
    const startTimeDecimal = convertTimeStringToDecimal(startTimeStr);
    const endTimeDecimal = convertTimeStringToDecimal(endTimeStr);
    const weekDay = day.slice(0, 3).toUpperCase(); // Abreviação do dia (e.g., MON)

    const startTime = convertTimeToMinutes(startTimeDecimal);
    const endTime = convertTimeToMinutes(endTimeDecimal);

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

      // Chama a função de callback do componente pai
      if (onAvailabilityChange) {
        onAvailabilityChange(updatedAvailability);
      }

      return updatedAvailability;
    });
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
                        className={`size-full p-2 ${availability.some((slot) => slot.startTime === convertTimeToMinutes(convertTimeStringToDecimal(interval.split('-')[0])) && slot.endTime === convertTimeToMinutes(convertTimeStringToDecimal(interval.split('-')[1])) && slot.weekDay === day.slice(0, 3).toUpperCase()) ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                        onClick={() =>
                          toggleTimeSlot(day as WeekDays, interval)
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            toggleTimeSlot(day as WeekDays, interval);
                          }
                        }}
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

export default WeekAvailabilityTable;
