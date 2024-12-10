import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router';

import { useRole } from '@/api/get-role-by-email';
import { CalendarView } from '@/components/ui/calendar/calendar-view';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useMsal } from '@azure/msal-react';

type DashboardContext = {
  setTitle: (title: string) => void;
};
export const CoordScheduleRoute = () => {
  interface AvailabilityFullfilled {
    userId: number;
    classId: string;
    possibilityId: string;
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

  useEffect(() => {
    setTitle('Schedule Editor'); // Set the desired title
  });


  const { instance } = useMsal();
  const currentAccount = instance.getActiveAccount();


  const roleQuery = useRole({ email: currentAccount?.username ?? '' });

  const userId = roleQuery.data?.userId;
  // const userId = 2;

  const [schedules, setSchedules] = useState<Record<string, any> | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<string>('');
  const [availabilitiesFullfilled, setAvailabilitiesFullfilled] = useState<
    AvailabilityFullfilled[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setTitle } = useOutletContext<DashboardContext>();

  const scheduleTableRef = useRef<HTMLDivElement>(null);
  const calendarViewRef = useRef<HTMLDivElement>(null);

  const handleGetSchedules = async (coordId: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}get_schedules_by_coordinator?userId=${coordId}`,
      );
      setSchedules(response.data.schedules);
    } catch (err) {
      setError('Failed to fetch schedules');
    } finally {
      setIsLoading(false);
    }
  };

  const convertClassesToAvailabilities = (classes: Record<string, Class>) => {
    const availabilitiesFullfilled: AvailabilityFullfilled[] = [];

    for (const [classId, classData] of Object.entries(classes)) {
      if (classData.fullfilledData) {
        availabilitiesFullfilled.push({
          userId: classData.fullfilledData.professorId,
          classId,
          possibilityId: classData.fullfilledData.possibilityId,
        });
      }
    }

    return availabilitiesFullfilled;
  };

  const handleSelectSchedule = async (schedule: string) => {
    setSelectedSchedule(schedule);
    setAvailabilitiesFullfilled(
      convertClassesToAvailabilities(schedules?.[schedule]?.classes),
    );
  };

  useEffect(() => {
    handleGetSchedules(userId || 0);
  }, [availabilitiesFullfilled, userId]);

  return (
    <div>
      <div className="flex h-screen items-center">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Coordinator Schedule</span>
          </h2>
          <p>View and manage your schedules</p>
          <div className="flex items-center justify-center gap-4">
            <button
              className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
              onClick={() =>
                scheduleTableRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Search a schedule
            </button>
          </div>
        </div>
      </div>
      <div
        ref={scheduleTableRef}
        id="schedule-table"
        className="flex min-h-screen flex-col items-center justify-center"
      >
        {isLoading ? (
          <p>Loading schedules...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : schedules ? (
          <Command className="min-h-[56vh]">
            <h2 className="p-4 text-2xl font-semibold">Schedules</h2>
            <CommandInput placeholder="Search by professor name or ID..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Schedules">
                {Object.keys(schedules).map((schedule) => (
                  <CommandItem
                    key={schedule}
                    onSelect={() => {
                      handleSelectSchedule(schedule);
                    }}
                  >
                    {schedule}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        ) : (
          <p>No schedules available for this coordinator.</p>
        )}
      </div>
      {selectedSchedule && (
        <div
          className="flex min-h-screen items-center justify-center"
          id="professor-table"
          ref={calendarViewRef}
        >
          <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
            <div className="mt-8 w-full max-w-5xl">
              <CalendarView
                possibilities={schedules?.[selectedSchedule]?.possibilities}
                classes={schedules?.[selectedSchedule]?.classes}
                scheduleId={selectedSchedule}
                availabilitiesFullfilled={availabilitiesFullfilled}
                setAvailabilitiesFullfilled={setAvailabilitiesFullfilled}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
