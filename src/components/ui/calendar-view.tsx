import axios from 'axios';
import React, { useState } from 'react';

import { toast } from '@/hooks/use-toast';

const convertMinutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

interface Availability {
  weekDay: string;
  startTime: number;
  endTime: number;
  isTaken: boolean;
}

interface Possibility {
  weekDay: string;
  startTime: number;
  endTime: number;
}

interface Professor {
  id: string;
  name: string;
  email: string;
  RA: string;
  availabilities: Record<string, Availability>;
}

interface Class {
  name: string;
  subjectCode: string;
  modality: string;
  classType: string;
  fullfilledData?: {
    professorId: string;
    possibilityId: string;
  };
}

interface Props {
  professors: Record<string, Professor>;
  possibilities: Record<string, Possibility>;
  classes: Record<string, Class>;
  scheduleId: string;
}

export const CalendarView: React.FC<Props> = ({
  professors,
  possibilities,
  classes,
  scheduleId,
}) => {
  const [hoverInfo, setHoverInfo] = useState<null | {
    time: string;
    people: { name: string; email: string }[];
  }>(null);

  const [selectedSlot, setSelectedSlot] = useState<null | {
    weekDay: string;
    time: string;
    startTime: number;
    endTime: number;
    people: { name: string; email: string; id: string }[];
    possibilityId?: string;
  }>(null);

  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const calendarData: Record<
    string,
    {
      time: string;
      startTime: number;
      endTime: number;
      people: { name: string; email: string; id: string }[];
      possibilityId?: string;
    }[]
  > = {};

  weekDays.forEach((day) => {
    calendarData[day] = [];
  });

  Object.values(professors).forEach((professor) => {
    Object.values(professor.availabilities).forEach((availability) => {
      const timeSlot = `${convertMinutesToTime(availability.startTime)} - ${convertMinutesToTime(
        availability.endTime,
      )}`;

      const isAvailableInPossibilities = Object.values(possibilities).some(
        (possibility) =>
          possibility.weekDay === availability.weekDay &&
          possibility.startTime === availability.startTime &&
          possibility.endTime === availability.endTime,
      );

      if (isAvailableInPossibilities) {
        const daySlots = calendarData[availability.weekDay];
        const existingSlot = daySlots.find((slot) => slot.time === timeSlot);

        if (existingSlot) {
          if (!existingSlot.people.some((p) => p.email === professor.email)) {
            existingSlot.people.push({
              name: professor.name,
              email: professor.email,
              id: professor.id,
            });
          }
        } else {
          const possibilityId = Object.keys(possibilities).find(
            (id) =>
              possibilities[id].weekDay === availability.weekDay &&
              possibilities[id].startTime === availability.startTime &&
              possibilities[id].endTime === availability.endTime,
          );

          daySlots.push({
            time: timeSlot,
            startTime: availability.startTime,
            endTime: availability.endTime,
            people: [
              {
                name: professor.name,
                email: professor.email,
                id: professor.id,
              },
            ],
            possibilityId,
          });
        }
      }
    });
  });

  weekDays.forEach((day) => {
    Object.values(possibilities).forEach((possibility) => {
      if (possibility.weekDay === day) {
        const timeSlot = `${convertMinutesToTime(possibility.startTime)} - ${convertMinutesToTime(
          possibility.endTime,
        )}`;
        const existingSlot = calendarData[day].find(
          (slot) => slot.time === timeSlot,
        );

        if (!existingSlot) {
          calendarData[day].push({
            time: timeSlot,
            startTime: possibility.startTime,
            endTime: possibility.endTime,
            people: [],
            possibilityId: Object.keys(possibilities).find(
              (id) =>
                possibilities[id].weekDay === day &&
                possibilities[id].startTime === possibility.startTime &&
                possibilities[id].endTime === possibility.endTime,
            ),
          });
        }
      }
    });
  });

  const handleSelectClass = (classId: string) => {
    setSelectedClass(classId);
  };

  const handleConfirmSelection = async (professorId: string) => {
    if (selectedSlot && selectedClass) {
      console.log(
        `Professor ID ${professorId} e Classe ${selectedClass} selecionados para o slot:`,
        selectedSlot,
      );
      console.log('Possibility ID:', selectedSlot.possibilityId);
      try {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}update_availabilities_fullfilled`,
          {
            scheduleId: scheduleId,
            availabilitiesFullfilled: [
              {
                userId: Number(professorId),
                classId: selectedClass,
                possibilityId: selectedSlot.possibilityId,
              },
            ],
          },
        );
        toast({
          title: 'Success',
          description: 'Professor and class selected successfully',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error selecting professor and class',
        });
        console.error(error);
      }

      setSelectedSlot(null);
      setSelectedClass(null);
    }
  };

  return (
    <div className="relative p-4">
      <h1 className="mb-4 text-2xl font-bold">
        Professor Availability Calendar
      </h1>
      <div className="grid grid-cols-6 gap-4">
        {weekDays.map((day) => (
          <div key={day} className="rounded-lg border p-2">
            <h2 className="mb-2 text-xl font-semibold">{day}</h2>
            {calendarData[day].length > 0 ? (
              calendarData[day].map((slot, index) => (
                <div
                  key={index}
                  className={`relative mb-2 cursor-pointer rounded p-2 ${
                    slot.people.length === 0
                      ? 'bg-black text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onMouseEnter={() =>
                    setHoverInfo({ time: slot.time, people: slot.people })
                  }
                  onMouseLeave={() => setHoverInfo(null)}
                  onClick={() =>
                    setSelectedSlot({
                      weekDay: day,
                      time: slot.time,
                      startTime: slot.startTime,
                      endTime: slot.endTime,
                      people: slot.people,
                      possibilityId: slot.possibilityId,
                    })
                  }
                >
                  <p>{slot.time}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No availability</p>
            )}
          </div>
        ))}
      </div>

      {hoverInfo && (
        <div className="absolute left-1/2 top-0 z-20 mt-4 -translate-x-1/2 rounded bg-gray-800 p-4 text-white shadow-lg">
          <h3 className="mb-2 font-semibold">Time: {hoverInfo.time}</h3>
          {hoverInfo.people.length > 0 ? (
            <ul>
              {hoverInfo.people.map((person, i) => (
                <li key={i}>
                  {person.name} ({person.email})
                </li>
              ))}
            </ul>
          ) : (
            <p>No professors available</p>
          )}
        </div>
      )}

      {selectedSlot && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800/50">
          <div className="w-1/2 rounded bg-white p-4 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">
              Select a professor and class for {selectedSlot.time} on{' '}
              {selectedSlot.weekDay}
            </h3>
            <div className="mb-4">
              <h4 className="font-bold">Classes:</h4>
              <ul>
                {Object.entries(classes).map(([id, classData]) => (
                  <li
                    key={id}
                    className={`cursor-pointer rounded p-2 ${
                      selectedClass === id
                        ? 'bg-blue-300'
                        : 'hover:bg-blue-600 hover:text-white'
                    }`}
                    onClick={() => handleSelectClass(id)}
                  >
                    {classData.name} ({classData.subjectCode}){' '}
                    {classData.modality}{' '}
                  </li>
                ))}
              </ul>
              <h4 className="mt-4 font-bold">Professors:</h4>
            </div>
            {selectedSlot.people.map((professor) => (
              <button
                key={professor.id}
                className="mb-2 w-full rounded p-2 hover:bg-blue-600 hover:text-white"
                onClick={() => handleConfirmSelection(professor.id)}
                disabled={!selectedClass}
              >
                {professor.name} ({professor.email})
              </button>
            ))}
            <button
              className="mt-4 w-full rounded bg-gray-300 p-2 hover:bg-gray-400"
              onClick={() => {
                setSelectedSlot(null);
                setSelectedClass(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
