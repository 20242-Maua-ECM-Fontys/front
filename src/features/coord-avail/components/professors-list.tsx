import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import type { Professor } from '@/types/api';

import { useProfessors } from '../api/get-professors';

type ProfessorsListProps = {
  setSelectedSubjects: (subjects: string[]) => void;
  setSelectedProfessor: (professor: Professor) => void;
};

export const ProfessorsList = ({
  setSelectedSubjects,
  setSelectedProfessor,
}: ProfessorsListProps) => {
  const professorsQuery = useProfessors({});
  const professors = professorsQuery.data?.professors;

  const handleProfessorSelect = (professor: Professor) => {
    setSelectedProfessor(professor);
    setSelectedSubjects(professor.suitabilities.map((s) => s.codeSubject));
    professorsQuery.refetch();
  };
  return (
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
                    handleProfessorSelect(professors[Number(professorId)]);
                    document
                      .getElementById('subject-possibilities')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {professors[Number(professorId)].name}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};
