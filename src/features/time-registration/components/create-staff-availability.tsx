import { ArrowLeft, ArrowRight } from 'lucide-react';

import { WeekDays } from '@/features/time-registration/types/availability';

export type CreateStaffAvailabilityProps = {
  timeIntervals: string[];
  availability: Record<WeekDays, string[]>;
  initialAvailability: Record<WeekDays, string[]>;
  setVisibleDayIndex: React.Dispatch<React.SetStateAction<number>>;
  toggleTimeSlot: (day: WeekDays, interval: string) => void;
  visibleDayIndex: number;
};

export const CreateStaffAvailability = ({
  timeIntervals,
  availability,
  initialAvailability,
  setVisibleDayIndex,
  toggleTimeSlot,
  visibleDayIndex,
}: CreateStaffAvailabilityProps) => {
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
                  Shift
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
                      className={`h-12 cursor-pointer select-none border p-0 transition duration-300 border-y-dashed ${
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
