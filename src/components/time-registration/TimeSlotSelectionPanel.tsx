import React from 'react';

type Props = {
  timeSlots: string[];
  selectedTimeSlot: string;
  onTimeSlotChange: (timeSlot: string) => void;
};

export const TimeSlotSelectionPanel: React.FC<Props> = ({
  timeSlots,
  selectedTimeSlot,
  onTimeSlotChange,
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold">Select a Time Slot</h3>
      <div className="grid grid-cols-3 gap-2 p-2">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => onTimeSlotChange(slot)}
            className={`rounded border p-2 transition duration-300 hover:cursor-pointer ${
              selectedTimeSlot === slot
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};
