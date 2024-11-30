import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import WeekAvailability from '@/components/ui/week-availability-update';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

export const TeacherSuitabilityAndAvailabilityRoute = () => {
  interface Availability {
    startTime: number; // em minutos
    endTime: number; // em minutos
    weekDay: string;
  }
  const [weekKey, setWeekKey] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isAvailLoaded, setIsAvailLoaded] = useState(false);
  const { userId } = useUser();

  interface Subject {
    codeSubject: string;
    subjectName: string;
    period: string;
  }

  window.scrollTo(0, 0);
  const handlegetSubjects = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_URL + 'get_all_subjects',
      );
      setSubjects(response.data.subjects);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handlegetAvailability = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}get_availabilities_by_professor?userId=${userId}`,
      );
      setAvailability(
        response.data.availabilities.map((a: any) => ({
          startTime: a.startTime,
          endTime: a.endTime,
          weekDay: a.weekDay,
        })),
      );
      setIsAvailLoaded(true);
      console.log(availability);
    } catch (error) {
      console.log(error);
    }
  };

  const handlegetSelectedSubjects = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}get_suitabilities_by_professor?userId=${userId}`,
      );
      setSelectedSubjects(
        response.data.suitabilities.map((s: any) => s.codeSubject),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAvailabilityChange = (newAvailability: Availability[]) => {
    setAvailability(newAvailability);
  };

  const handleSubjectAdd = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      return;
    }
    setSelectedSubjects([...selectedSubjects, subject]);
    console.log(selectedSubjects);
  };

  const handleUpdateSubjects = async (selectedSubjects: string[]) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_APP_API_URL + 'update_suitabilities',
        {
          userId: userId,
          subjectCodes: selectedSubjects,
        },
      );
      toast({
        title: 'Success',
        description: 'Subjects updated successfully',
      });
      console.log(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error updating subjects',
      });
      console.log(error);
    }
  };

  const handleUpdateAvailability = async (availability: Availability[]) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_APP_API_URL + 'update_availabilities',
        {
          userId: userId,
          availabilities: availability,
        },
      );
      toast({
        title: 'Success',
        description: 'Availability updated successfully',
      });
      console.log(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Error updating availability',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    handlegetSubjects();
    handlegetSelectedSubjects();
    handlegetAvailability();
    window.scrollTo(0, 0);
    setWeekKey(weekKey + 1);
  }, []);

  return (
    <div>
      <div className="flex h-screen items-center">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Availability and Suitability</span>
          </h2>
          <div className="flex items-center justify-center gap-4">
            <button
              className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
              onClick={() =>
                document
                  .getElementById('subject-possibilities')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Fill suitabilities
            </button>
            <button
              className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
              onClick={() =>
                document
                  .getElementById('table-possibilities')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Fill availabilities
            </button>
          </div>
        </div>
      </div>
      <div id="subject-possibilities" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-2xl font-semibold">Selected Subjects:</h2>
          <div className="flex flex-wrap justify-center gap-2 text-center">
            {selectedSubjects.length === 0 ? (
              <span className="rounded bg-gray-200 px-3 py-1 text-gray-800">
                No subjects selected
              </span>
            ) : (
              selectedSubjects.map((subject) => (
                <span
                  key={subject}
                  className="flex items-center gap-2 rounded bg-green-400 px-3 py-1"
                >
                  {subject}
                </span>
              ))
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex h-[49vh] items-center justify-center">
            <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
          </div>
        ) : (
          <Command className="min-h-[49vh]">
            <CommandInput placeholder="Type a subject name..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Subjects">
                {subjects.map((subject: Subject) => (
                  <CommandItem
                    key={subject.codeSubject}
                    onSelect={() => handleSubjectAdd(subject.codeSubject)}
                  >
                    {subject.subjectName}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        )}
        <div className="flex justify-center">
          <button
            className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
            onClick={() => {
              document
                .getElementById('table-possibilities')
                ?.scrollIntoView({ behavior: 'smooth' });
              handleUpdateSubjects(selectedSubjects);
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div
        className="mx-auto mt-10 flex h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 md:mt-0 lg:px-8 lg:py-10"
        id="table-possibilities"
      >
        <h3 className="mb-4 text-center text-xl font-bold">
          Set Your Availability
        </h3>
        {isAvailLoaded ? (
          <WeekAvailability
            startHour={'07:40'}
            endHour={'22:20'}
            key={weekKey}
            initialAvailability={availability}
            onAvailabilityChange={handleAvailabilityChange}
          />
        ) : (
          <div className="flex items-center justify-center">
            <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
            onClick={() => {
              handleUpdateAvailability(availability);
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
