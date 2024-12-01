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
  period: 'morning' | 'afternoon' | 'night' | 'full'; // Novo parâmetro
  initialAvailability: Availability[];
  onAvailabilityChange: (newAvailability: Availability[]) => void;
}

// Configurações de horários para os períodos
const PERIOD_TIMES = {
  morning: { start: 460, end: 780 }, // 7h40 - 13h00
  afternoon: { start: 790, end: 1110 }, // 13h10 - 18h30
  night: { start: 1140, end: 1350 }, // 19h00 - 22h20
  full: [
    { start: 460, end: 780 }, // 7h40 - 13h00
    { start: 790, end: 1110 }, // 13h10 - 18h30
    { start: 1140, end: 1350 }, // 19h00 - 22h20
  ],
};

// Função para gerar os intervalos de tempo em minutos
const generateCustomTimeIntervals = (
  periods: { start: number; end: number }[],
) => {
  const timeIntervals: string[] = [];

  periods.forEach(({ start, end }) => {
    let currentTime = start;

    while (currentTime + 100 <= end) {
      const startTime = convertMinutesToTime(currentTime);
      const endTime = convertMinutesToTime(currentTime + 100);
      timeIntervals.push(`${startTime} - ${endTime}`);
      currentTime += 110; // Adiciona 100 minutos de aula + 10 minutos de intervalo
    }
  });

  return timeIntervals;
};

// Converte minutos para uma string no formato "HH:MM"
const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Converte uma string no formato "HH:MM" para minutos
const convertTimeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const WeekAvailabilityTable: React.FC<WeekAvailabilityTableProps> = ({
  period,
  initialAvailability,
  onAvailabilityChange,
}) => {
  const [availability, setAvailability] =
    useState<Availability[]>(initialAvailability);
  const [visibleDayIndex, setVisibleDayIndex] = useState(0);

  // Gera os intervalos de tempo com base no período
  const timeIntervals =
    period === 'full'
      ? generateCustomTimeIntervals(PERIOD_TIMES.full)
      : generateCustomTimeIntervals([PERIOD_TIMES[period]]);

  const toggleTimeSlot = (day: WeekDays, interval: string) => {
    const [startTimeStr, endTimeStr] = interval.split(' - ');
    const startTime = convertTimeToMinutes(startTimeStr);
    const endTime = convertTimeToMinutes(endTimeStr);
    const weekDay = day.slice(0, 3).toUpperCase(); // Abreviação do dia (e.g., MON)

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
                      className={`cursor-pointer border p-2 text-sm transition md:text-base ${
                        index !== visibleDayIndex ? 'hidden md:table-cell' : ''
                      } ${
                        availability.some(
                          (slot) =>
                            slot.startTime ===
                              convertTimeToMinutes(interval.split('-')[0]) &&
                            slot.endTime ===
                              convertTimeToMinutes(interval.split('-')[1]) &&
                            slot.weekDay === day.slice(0, 3).toUpperCase(),
                        )
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
        </div>
      </div>
    </div>
  );
};

export default WeekAvailabilityTable;
