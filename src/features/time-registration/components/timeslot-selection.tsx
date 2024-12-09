import React from 'react';

type TimeSlotSelectionProps = {
  timeSlots: string[];
  selectedTimeSlot: string;
  onTimeSlotChange: (timeSlot: string) => void;
};

export const TimeslotSelection: React.FC<TimeSlotSelectionProps> = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotChange,
}) => {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">Select a Time Slot</h3>
      <div className="grid grid-cols-3 gap-2 p-2">
        {timeSlots.map((timeSlot) => (
          <button
            key={timeSlot}
            onClick={() => onTimeSlotChange(timeSlot)}
            className={`rounded border p-2 transition duration-300 hover:cursor-pointer ${
              selectedTimeSlot === timeSlot
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {timeSlot}
          </button>
        ))}
      </div>
    </div>
  );
};
