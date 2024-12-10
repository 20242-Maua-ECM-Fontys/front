import { useSubjects } from '@/api/get-subjects';
import { useUpdateSubjects } from '@/api/update-subjects';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { toast } from '@/hooks/use-toast';
import type { Subject } from '@/types/api';

export const SubjectPossibilities = ({
  userId,
  selectedSubjects,
  setSelectedSubjects,
}: {
  userId?: number;
  selectedSubjects: string[];
  setSelectedSubjects: (value: string[]) => void;
}) => {
  const subjectsQuery = useSubjects({});
  const handleSubjectAdd = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      return;
    }
    setSelectedSubjects([...selectedSubjects, subject]);
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

  const handleSave = () => {
    if (userId !== undefined) {
      updateSubjectsMutation.mutate({
        userId,
        subjectCodes: selectedSubjects,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User ID is null',
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl p-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Selected Subjects:</h2>
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
        <div className="flex h-full items-center justify-center">
          <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
        </div>
      ) : (
        <Command className="min-h-full">
          <CommandInput placeholder="Type a subject name..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Subjects">
              {subjectsQuery.data?.subjects.map((subject: Subject) => (
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
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};
