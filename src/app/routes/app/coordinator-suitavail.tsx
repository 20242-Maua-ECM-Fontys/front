import { randUuid } from '@ngneat/falso';
import { useEffect, useState } from 'react';

import { useProfessorId } from '@/api/get-professor-id';
import { useSubjects } from '@/api/get-subjects';
import { useUpdateSubjects } from '@/api/update-subjects';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { WeekAvailabilityTable } from '@/components/ui/week-availability-update';
import type { Professor, Subject } from '@/types/api';

import { ProfessorsList } from '../../../features/coord-avail/components/professors-list';
import { toast } from '../../../hooks/use-toast';

export const CoordinatorSuitAvailRoute = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] =
    useState<Professor | null>();

  const professorRoleQuery = useProfessorId({
    email: selectedProfessor?.email ?? '',
    queryConfig: {
      enabled: !!selectedProfessor?.email,
    },
  });

  const professorUserId = professorRoleQuery.data?.userId;

  const subjectsQuery = useSubjects({});

  const subjectsData = subjectsQuery.data?.subjects;

  const updateSubjectsMutation = useUpdateSubjects({
    mutationConfig: {
      onSuccess: () => {
        toast({
          title: 'Success',
          description: 'Subjects updated successfully',
        });
      },
      onError: () => {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Error updating subjects',
        });
      },
    },
  });

  const handleSubjectAdd = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      return;
    }
    setSelectedSubjects([...selectedSubjects, subject]);
  };

  useEffect(() => {
    if (selectedProfessor) {
      professorRoleQuery.refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProfessor]);

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
        <ProfessorsList
          setSelectedSubjects={setSelectedSubjects}
          setSelectedProfessor={setSelectedProfessor}
        />
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
              {subjectsData?.map((subject: Subject) => (
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
              onClick={() => {
                document
                  .getElementById('table-possibilities')
                  ?.scrollIntoView({ behavior: 'smooth' });
                if (professorUserId !== undefined) {
                  updateSubjectsMutation.mutate({
                    userId: professorUserId,
                    subjectCodes: selectedSubjects,
                  });
                } else {
                  toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'User ID is null',
                  });
                }
              }}
              className="mt-4 rounded bg-gray-400 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
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
        <WeekAvailabilityTable
          startHour={'07:40'}
          endHour={'22:30'}
          initialAvailability={selectedProfessor?.availabilities || []}
          key={randUuid() + Math.random()}
          userId={professorUserId ?? 0}
        />
      </div>
    </div>
  );
};
