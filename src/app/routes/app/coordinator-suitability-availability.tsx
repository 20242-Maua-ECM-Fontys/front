import axios from 'axios';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
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

export const CoordinatorSuitabilityAndAvailabilityRoute = () => {
  interface Subject {
    codeSubject: string;
    subjectName: string;
    period: string;
  }
  interface Availability {
    startTime: number; // em minutos
    endTime: number; // em minutos
    weekDay: string;
  }

  type Professor = {
    name: string;
    email: string;
    availabilities: Availability[];
    suitabilities: {
      codeSubject: string;
      subjectName: string;
    }[];
  };

  type Professors = {
    [key: number]: {
      name: string;
      email: string;
      availabilities: {
        startTime: number;
        endTime: number;
        weekDay: string;
      }[];
      suitabilities: {
        codeSubject: string;
        subjectName: string;
      }[];
    };
  };
  const [weekKey, setWeekKey] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null,
  );
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [professors, setProfessors] = useState<Professors | null>(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professorId, setProfessorId] = useState<number | null>(null);

  const handleGetProfessors = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_URL + 'get_all_professors',
      );
      setProfessors(response.data.professors);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfessorSelect = (
    professor: Professor,
    professorIdString: string,
  ) => {
    const professorId = parseInt(professorIdString);
    setProfessorId(professorId);
    setSelectedProfessor(professor);
    setSelectedSubjects(professor.suitabilities.map((s) => s.codeSubject));
    setWeekKey((prevKey) => prevKey + 1);
  };

  const handleSubjectAdd = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      return;
    }
    setSelectedSubjects([...selectedSubjects, subject]);
  };

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

  useEffect(() => {
    handleGetProfessors();
    handlegetSubjects();
    window.scrollTo(0, 0);
  }, []);

  const handleAvailabilityChange = (newAvailability: Availability[]) => {
    setAvailability(newAvailability);
  };

  const handleUpdateSubjects = async (selectedSubjects: string[]) => {
    try {
      const response = await axios.put(
        import.meta.env.VITE_APP_API_URL + 'update_suitabilities',
        {
          userId: professorId,
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
          userId: professorId,
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
  return (
    <div>
      <div className="flex h-screen items-center">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Teachers Availability and Suitability</span>
          </h2>
          <p>View and manage teachers availability and suitability</p>
          <div className="flex items-center justify-center gap-4">
            <button
              className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
              onClick={() =>
                document
                  .getElementById('teachers-table')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Search a teacher
            </button>
          </div>
        </div>
      </div>
      <div
        id="teachers-table"
        className="flex min-h-screen items-center justify-center"
      >
        <div className="flex size-full p-4">
          <Command className="min-h-[56vh]">
            <h2 className="p-4 text-2xl font-semibold">Professors</h2>
            <CommandInput placeholder="Type a professor name..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Professors">
                {professors &&
                  Object.keys(professors).map((professorId) => (
                    <CommandItem
                      key={professorId}
                      onSelect={() => {
                        handleProfessorSelect(
                          professors[professorId],
                          professorId,
                        );
                        document
                          .getElementById('subject-possibilities')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {professors[professorId].name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
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
        <div className="flex items-center justify-center gap-4">
          {selectedProfessor ? (
            <Button
              className="mt-4 rounded bg-gray-400 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
              onClick={() => handleUpdateSubjects(selectedSubjects)}
            >
              Save
            </Button>
          ) : (
            <Button
              disabled
              className="mt-4 rounded bg-gray-200 px-4 py-2 text-black transition duration-300"
            >
              Save
            </Button>
          )}
        </div>
      </div>

      <div
        className="mx-auto mt-10 flex min-h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 md:mt-0 lg:px-8 lg:py-10"
        id="table-possibilities"
      >
        <h3 className="mb-4 text-center text-xl font-bold">
          Set Your Availability
        </h3>
        <WeekAvailability
          startHour={'07:40'}
          endHour={'22:20'}
          initialAvailability={selectedProfessor?.availabilities || []}
          onAvailabilityChange={handleAvailabilityChange}
          key={weekKey}
        />
        <div className="flex items-center justify-center gap-4">
          {selectedProfessor ? (
            <Button
              className="mt-4 rounded bg-gray-400 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
              onClick={() => handleUpdateAvailability(availability)}
            >
              Save
            </Button>
          ) : (
            <Button
              disabled
              className="mt-4 rounded bg-gray-200 px-4 py-2 text-black transition duration-300"
            >
              Save
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
