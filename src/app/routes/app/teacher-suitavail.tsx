import { useMsal } from '@azure/msal-react';
import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import { useRole } from '@/api/get-role-by-email';
import { ContentLayout } from '@/components/layouts';
import { SubjectPossibilities } from '@/features/teacher-avail/components/subject-possibilities';
import { TablePossibilities } from '@/features/teacher-avail/components/table-possibilities';
type DashboardContext = {
  setTitle: (title: string) => void;
};
export const TeacherSuitAvailRoute = () => {
  const { instance } = useMsal();
  const currentAccount = instance.getActiveAccount();
  const roleQuery = useRole({ email: currentAccount?.username ?? '' });
  const [step, setStep] = React.useState(1);
  const userId = roleQuery.data?.userId;
  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([]);
  const { setTitle } = useOutletContext<DashboardContext>();

  useEffect(() => {
    setTitle('Availability'); // Set the desired title
  });
  return (
    <ContentLayout title="Time Registration">
      <div>
        <div className="mb-6 flex items-center justify-center gap-4 sm:flex-wrap md:flex-nowrap md:justify-around">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              selectedSubjects.length > 0
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(1)}
          >
            <h4 className="text-lg font-semibold">Select Subjects</h4>
            {selectedSubjects && <p>{selectedSubjects.length}</p>}
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
            <h4 className="text-lg font-semibold">Availability</h4>
            {selectedSubjects && <p>{selectedSubjects.length}</p>}
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
                <SubjectPossibilities
                  userId={userId}
                  setSelectedSubjects={setSelectedSubjects}
                  selectedSubjects={selectedSubjects}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="col-span-3">
              <TablePossibilities userId={userId} />
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
