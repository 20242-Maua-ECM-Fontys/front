import React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Subject, Professor } from '@/types/api';

interface SubjectPossibilitiesProps {
  subjectsData: Subject[] | undefined;
  selectedSubjects: string[];
  setSelectedSubjects: (subjects: string[]) => void;
  selectedProfessor: Professor | null | undefined;
  professorUserId?: string | number;
  updateSubjectsMutation: any;
}

export const SubjectPossibilities = ({
  subjectsData,
  selectedSubjects,
  setSelectedSubjects,
  selectedProfessor,
  professorUserId,
  updateSubjectsMutation,
}: SubjectPossibilitiesProps) => {
  const handleSubjectAdd = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
      return;
    }
    setSelectedSubjects([...selectedSubjects, subject]);
  };

  return (
    <div id="subject-possibilities" className="">
      <Command className="min-h-[49vh]">
        <CommandInput placeholder="Type a subject name..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Subjects">
            {subjectsData?.map((subject) => (
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
  );
};
