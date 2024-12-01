import { useMsal } from '@azure/msal-react';
import { useState } from 'react';

import { useRole } from '@/api/get-role-by-email';
import { useUpdateSubjects } from '@/api/update-subjects';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { WeekAvailabilityTable } from '@/components/ui/week-availability-update';
import { useSubjects } from '@/features/teacher-avail/api/get-subjects';
import type { Subject } from '@/features/teacher-avail/types/subject';
import { toast } from '@/hooks/use-toast';
import type { Availability } from '@/types/api';

export const TeacherSuitAvailRoute = () => {
  const [weekKey] = useState(0);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const { instance } = useMsal();
  const currentAccount = instance.getActiveAccount();

  const roleQuery = useRole({ email: currentAccount?.username ?? '' });

  const userId = roleQuery.data?.userId;

  const subjectsQuery = useSubjects({});

  const subjects = subjectsQuery.data?.subjects;

  const handleSubjectAdd = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      return;
    }
    setSelectedSubjects([...selectedSubjects, subject]);
    console.log(selectedSubjects);
  };

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

        {subjectsQuery.isLoading ? (
          <div className="flex h-[49vh] items-center justify-center">
            <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
          </div>
        ) : (
          <Command className="min-h-[49vh]">
            <CommandInput placeholder="Type a subject name..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Subjects">
                {subjects &&
                  subjects.map((subject: Subject) => (
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
              if (userId !== undefined) {
                updateSubjectsMutation.mutate({
                  userId: userId,
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
        <WeekAvailabilityTable
          startHour={'07:40'}
          endHour={'22:30'}
          key={weekKey}
          initialAvailability={availabilities}
          onAvailabilityChange={(Availabilities) =>
            setAvailabilities(Availabilities)
          }
        />
      </div>
    </div>
  );
};
