import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';

const convertMinutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

interface AvailabilityFullfilled {
  userId: number;
  classId: string;
  possibilityId: string;
}

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
  availabilities: Availability[];
}

interface Class {
  name: string;
  subjectCode: string;
  modality: string;
  classType: string;
  fullfilledData?: {
    professorId: number;
    possibilityId: string;
  };
}

interface Props {
  possibilities: Record<string, Possibility>;
  classes: Record<string, Class>;
  scheduleId: string;
  availabilitiesFullfilled: AvailabilityFullfilled[];
  setAvailabilitiesFullfilled: React.Dispatch<
    React.SetStateAction<AvailabilityFullfilled[]>
  >;
}

export const CalendarView: React.FC<Props> = ({
  possibilities,
  classes,
  scheduleId,
  availabilitiesFullfilled,
  setAvailabilitiesFullfilled,
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
    possibilityId?: string;
    isFullfilled?: boolean;
    classId?: string;
  }>(null);

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const calendarData: Record<
    string,
    {
      time: string;
      startTime: number;
      endTime: number;
      possibilityId?: string;
      isFullfilled?: boolean;
      weekDay: string;
    }[]
  > = {};

  weekDays.forEach((day) => {
    calendarData[day] = [];
  });

  Object.values(possibilities).forEach((possibility) => {
    const daySlots = calendarData[possibility.weekDay];
    const timeSlot = `${convertMinutesToTime(possibility.startTime)} - ${convertMinutesToTime(
      possibility.endTime,
    )}`;
    const possibilityId = Object.keys(possibilities).find(
      (id) =>
        possibilities[id].weekDay === possibility.weekDay &&
        possibilities[id].startTime === possibility.startTime &&
        possibilities[id].endTime === possibility.endTime,
    );

    const fullfilled = Object.values(classes).some(
      (classItem) =>
        classItem.fullfilledData &&
        classItem.fullfilledData.possibilityId === possibilityId,
    );

    if (!daySlots.find((slot) => slot.time === timeSlot)) {
      daySlots.push({
        time: timeSlot,
        weekDay: possibility.weekDay,
        startTime: possibility.startTime,
        endTime: possibility.endTime,
        possibilityId,
        isFullfilled: fullfilled,
      });
    }
  });

  const getAllProfessors = async () => {
    try {
      const response = await axios.get<Professor[]>(
        `${import.meta.env.VITE_APP_API_URL}/get_all_professors`,
      );
      const professorsList: Professor[] = [];
      const professorsData = response.data.professors;
      for (const professorId in professorsData) {
        const professor = professorsData[professorId];
        professorsList.push({
          id: professorId,
          name: professor.name,
          email: professor.email,
          RA: '',
          availabilities: Object.values(professor.availabilities),
        });
      }
      setProfessors(professorsList);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch professors',
      });
      console.error(error);
    }
  };

  useEffect(() => {
    getAllProfessors();
  }, []);

  const handleSelectClass = async (classId: string) => {
    setSelectedClass(classId);
    try {
      const response = await axios.get<Professor[]>(
        `${import.meta.env.VITE_APP_API_URL}/get_professors_by_class?classId=${classId}`,
      );
      const professorsList: Professor[] = [];
      const professorsForClass = response.data.professors;
      for (const professorId in professorsForClass) {
        const professor = professorsForClass[professorId];
        professorsList.push({
          id: professorId,
          name: professor.name,
          email: professor.email,
          RA: professor.RA,
          availabilities: Object.values(professor.availabilities),
        });
      }
      setProfessors(professorsList);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch professors for the selected class',
      });
      console.error(error);
    }
  };

  const handleConfirmSelection = async (professorId: string) => {
    if (selectedSlot && selectedClass) {
      const newFullfilled = [
        ...availabilitiesFullfilled,
        {
          userId: parseInt(professorId),
          classId: selectedClass,
          possibilityId: selectedSlot.possibilityId,
        },
      ];
      try {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/update_availabilities_fullfilled`,
          {
            scheduleId,
            availabilitiesFullfilled: newFullfilled,
          },
        );
        toast({
          title: 'Success',
          description: 'Professor and class selected successfully',
        });
        setSelectedSlot(null);
        setSelectedClass(null);
        setAvailabilitiesFullfilled(newFullfilled);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error selecting professor and class',
        });
        console.error('Error confirming selection:', error);
      }
    }
  };

  const handleDeleteFullfilled = async () => {
    try {
      const updatedAvailabilities = availabilitiesFullfilled.filter(
        (av) => av.possibilityId !== selectedSlot!.possibilityId,
      );

      await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/update_availabilities_fullfilled`,
        {
          scheduleId,
          availabilitiesFullfilled: updatedAvailabilities,
        },
      );
      toast({
        title: 'Success',
        description: 'Professor and class selection deleted successfully',
      });
      setSelectedSlot(null);
      setSelectedClass(null);
      setAvailabilitiesFullfilled(updatedAvailabilities);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error deleting professor and class selection',
      });
      console.error('Error deleting fullfilled:', error);
    }
  };

  const handleSlotClick = (slot: any) => {
    if (slot.isFullfilled) {
      const fullfilledClass = Object.values(classes).find(
        (classItem) =>
          classItem.fullfilledData &&
          classItem.fullfilledData.possibilityId === slot.possibilityId,
      );
      const professorInfo = fullfilledClass?.fullfilledData
        ? professors.find(
            (professor) =>
              professor.id == fullfilledClass.fullfilledData?.professorId,
          )
        : null;

      setHoverInfo({
        time: slot.time,
        people: [
          {
            name: professorInfo?.name || 'Unknown',
            email: professorInfo?.email || 'Unknown',
          },
        ],
      });
      setSelectedSlot({
        weekDay: slot.weekDay,
        time: slot.time,
        startTime: slot.startTime,
        endTime: slot.endTime,
        possibilityId: slot.possibilityId,
        isFullfilled: true,
      });
    } else {
      setSelectedSlot({
        weekDay: slot.weekDay,
        time: slot.time,
        startTime: slot.startTime,
        endTime: slot.endTime,
        possibilityId: slot.possibilityId,
        isFullfilled: false,
      });
    }
  };

  return (
    <div className="relative p-4">
      <h2 className="p-4 text-2xl font-semibold">Classes of this schedule</h2>
      <div className="flex items-center justify-center gap-4 p-4">
        <button className="rounded bg-green-200 p-2">Theory</button>
        <button className="rounded bg-blue-200 p-2">Practice</button>
        <button className="rounded bg-orange-300 p-2">Laboratory</button>
      </div>
      <div className="flex items-center justify-center gap-4">
        {Object.keys(classes).map((classId) => (
          <button
            key={classId}
            className={`rounded p-4 transition duration-300 hover:bg-blue-400 hover:text-white focus:outline-none focus:ring ${
              selectedClass === classId ? 'bg-blue-400 text-white' : ''
            } ${Object.values(availabilitiesFullfilled).some((av) => av.classId === classId) ? 'opacity-50' : 'bg-gray-300'} ${classes[classId].classType === 'THEORY' ? 'bg-green-200' : classes[classId].classType === 'PRACTICE' ? 'bg-blue-200' : 'bg-orange-300'}`}
            onClick={() => handleSelectClass(classId)}
            disabled={Object.values(availabilitiesFullfilled).some(
              (av) => av.classId === classId,
            )}
          >
            {`${classes[classId].name} - ${classes[classId].subjectCode} ${classes[classId].modality}`}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="w-24 border border-gray-300 bg-gray-100 p-2">
                Times
              </th>
              {weekDays.map((day) => (
                <th
                  key={day}
                  className="w-24 border border-gray-300 bg-gray-100 p-2"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ...new Set(
                Object.keys(calendarData).flatMap((day) =>
                  calendarData[day].map((slot) => slot.time),
                ),
              ),
            ]
              .sort()
              .map((time, timeIndex) => (
                <tr key={timeIndex}>
                  <td className="w-24 border border-gray-300 bg-gray-200 p-2">
                    {time}
                  </td>
                  {weekDays.map((day) => {
                    const slot = calendarData[day]?.find(
                      (s) => s.time === time,
                    );
                    return (
                      <td
                        key={`${day}-${time}`}
                        className={`border border-gray-300 p-2 text-center ${
                          slot?.isFullfilled
                            ? Object.values(classes)
                                .map((classItem) => {
                                  if (
                                    classItem.fullfilledData?.possibilityId ===
                                    slot?.possibilityId
                                  ) {
                                    if (classItem.classType === 'THEORY') {
                                      return 'bg-green-200';
                                    }
                                    if (classItem.classType === 'PRACTICE') {
                                      return 'bg-blue-200';
                                    }
                                    if (classItem.classType === 'LAB') {
                                      return 'bg-orange-300';
                                    }
                                  }
                                  return '';
                                })
                                .join(' ')
                            : 'cursor-pointer hover:bg-gray-300'
                        } ${
                          selectedSlot?.time === slot?.time &&
                          selectedSlot?.weekDay === day &&
                          'bg-gray-200 text-white'
                        } w-24`}
                        onClick={() => slot && handleSlotClick(slot)}
                      >
                        {slot ? (
                          slot.isFullfilled ? (
                            <div>
                              {Object.values(classes).map((classItem) => {
                                if (
                                  classItem.fullfilledData?.possibilityId ===
                                  slot.possibilityId
                                ) {
                                  return (
                                    <span key={classItem.subjectCode}>
                                      {classItem.subjectCode}
                                    </span>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          ) : (
                            <span className="text-gray-500"></span>
                          )
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && selectedClass && !selectedSlot.isFullfilled && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800/50">
          <div className="w-1/2 rounded bg-white p-4 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">
              Select a professor for {selectedSlot.time} on{' '}
              {selectedSlot.weekDay}
            </h3>

            {professors.length > 0 ? (
              professors
                .filter((professor) => {
                  const isAvailable = professor.availabilities.some(
                    (availability) =>
                      availability.weekDay == selectedSlot.weekDay &&
                      availability.startTime == selectedSlot.startTime &&
                      availability.endTime == selectedSlot.endTime,
                  );
                  return isAvailable;
                })
                .map((professor) => (
                  <button
                    key={professor.id}
                    className="mb-2 w-full rounded p-2 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring"
                    onClick={() => handleConfirmSelection(professor.id)}
                  >
                    {professor.name} ({professor.email})
                  </button>
                ))
            ) : (
              <p>No professors available for this class.</p>
            )}

            <button
              className="mt-4 w-full rounded bg-gray-300 p-2 hover:bg-gray-400 focus:outline-none focus:ring"
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

      {hoverInfo && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-800/50">
          <div className="w-1/2 rounded bg-white p-4 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold">Slot Information</h3>
            <p>Time: {hoverInfo.time}</p>
            {hoverInfo.people.map((person, idx) => (
              <div key={idx} className="mt-2">
                <p></p>
                <p>Name: {person.name}</p>
                <p>Email: {person.email}</p>
              </div>
            ))}
            <div>
              {Object.values(classes).map((classItem) => {
                if (
                  classItem.fullfilledData?.possibilityId ===
                  selectedSlot!.possibilityId
                ) {
                  return (
                    <span key={classItem.subjectCode}>
                      {`Class: ${classItem.name} - ${classItem.subjectCode}`}
                    </span>
                  );
                }
                return null;
              })}
            </div>
            <button
              className="mt-4 w-full rounded bg-red-400 p-2 hover:bg-red-500 hover:text-white focus:outline-none focus:ring"
              onClick={() => {
                handleDeleteFullfilled();
                setHoverInfo(null);
              }}
            >
              Delete
            </button>
            <button
              className="mt-4 w-full rounded bg-gray-300 p-2 hover:bg-gray-400 focus:outline-none focus:ring"
              onClick={() => setHoverInfo(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
