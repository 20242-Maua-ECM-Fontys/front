import React from 'react';

type SemesterSelectionProps = {
  uniqueYears: string[];
  uniqueSemesters: string[];
  selectedSemester?: string;
  selectedYear?: number;
  onSemesterChange: (semester: string) => void;
  onYearChange: (year: number) => void;
  isEngineering: boolean;
};

export const SemesterSelection: React.FC<SemesterSelectionProps> = ({
  uniqueYears,
  uniqueSemesters,
  selectedSemester,
  selectedYear,
  onSemesterChange,
  onYearChange,
  isEngineering,
}) => {
  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">
        {isEngineering ? 'Select a Year' : 'Select a Semester'}
      </h3>
      <div className="grid grid-cols-3 gap-2 p-2">
        {isEngineering ? (
          <>
            {uniqueYears.map((yearOption) => {
              const yearMatch = yearOption.match(/\d+/);
              const extractedYear = yearMatch ? parseInt(yearMatch[0], 10) : 1;
              return (
                <button
                  key={yearOption}
                  onClick={() => {
                    onYearChange(extractedYear);
                  }}
                  className={`rounded border p-4 transition duration-300 ${
                    selectedYear === extractedYear
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  } hover:bg-blue-400 hover:text-white`}
                >
                  {yearOption}
                </button>
              );
            })}
          </>
        ) : (
          <>
            {uniqueSemesters.map((semesterOption) => {
              const semesterMatch = semesterOption.match(/\d+/);
              const semesterNumber = semesterMatch
                ? parseInt(semesterMatch[0], 10)
                : 1;
              const calculatedYear = Math.ceil(semesterNumber / 2);
              return (
                <button
                  key={semesterOption}
                  onClick={() => {
                    onYearChange(calculatedYear);
                    onSemesterChange(semesterOption);
                  }}
                  className={`rounded border p-4 transition duration-300 ${
                    selectedSemester === semesterOption
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  } hover:bg-blue-400 hover:text-white`}
                >
                  {semesterOption}
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
