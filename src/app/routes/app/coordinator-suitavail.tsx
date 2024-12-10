import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

import { useProfessorId } from '@/api/get-professor-id';
import { useSubjects } from '@/api/get-subjects';
import { useUpdateSubjects } from '@/api/update-subjects';
import { ContentLayout } from '@/components/layouts';
import { ProfessorsList } from '@/features/coord-avail/components/professors-list';
import { SubjectPossibilities } from '@/features/coord-avail/components/subject-possibilities';
import { TablePossibilities } from '@/features/coord-avail/components/table-possibilities';
import { toast } from '@/hooks/use-toast';
import { Availability, Professor } from '@/types/api';
type DashboardContext = {
  setTitle: (title: string) => void;
};
export const CoordinatorSuitAvailRoute = () => {
  const [step, setStep] = useState(1); // Active panel step
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedProfessor, setSelectedProfessor] =
    useState<Professor | null>();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]); // Track availability
  const { setTitle } = useOutletContext<DashboardContext>();

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
        setStep(3);
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

  useEffect(() => {
    setTitle('Teachers'); // Set the desired title
    if (selectedProfessor) {
      professorRoleQuery.refetch();
    }
  }, [professorRoleQuery, selectedProfessor, setTitle]);

  return (
    <ContentLayout title="Time Registration">
      <div>
        <div className="mb-6 flex items-center justify-center gap-4 sm:flex-wrap md:flex-nowrap md:justify-around">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 p-6 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              selectedProfessor
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(1)}
          >
            <h4 className="text-lg font-semibold">Select Professor</h4>
            {selectedProfessor && <p>{selectedProfessor.name}</p>}
          </div>

          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 p-6 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              selectedSubjects.length > 0
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(2)}
          >
            <h4 className="text-lg font-semibold">Select Suitabilities</h4>
          </div>

          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 p-6 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              selectedProfessor?.availabilities.length != undefined &&
              selectedProfessor?.availabilities.length > 0
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(3)}
          >
            <h4 className="text-lg font-semibold">Select Availabilities</h4>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Dynamic content */}
          {step === 1 && (
            <div className="col-span-3">
              <div
                id="teachers-table"
                className="flex items-center justify-center"
              >
                <ProfessorsList
                  setSelectedSubjects={setSelectedSubjects}
                  setSelectedProfessor={setSelectedProfessor}
                  setStep={setStep}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="col-span-3">
              <SubjectPossibilities
                subjectsData={subjectsData}
                selectedSubjects={selectedSubjects}
                setSelectedSubjects={setSelectedSubjects}
                selectedProfessor={selectedProfessor}
                professorUserId={professorUserId}
                updateSubjectsMutation={updateSubjectsMutation}
              />
            </div>
          )}

          {step === 3 && (
            <div className="col-span-3">
              <TablePossibilities
                professorUserId={professorUserId}
                selectedProfessor={selectedProfessor}
                availabilities={availabilities}
                setAvailabilities={setAvailabilities}
              />
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
