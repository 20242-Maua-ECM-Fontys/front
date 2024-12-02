import React from 'react';

type Props = {
  semesters: string[];
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
};

export const SemesterSelectionPanel: React.FC<Props> = ({
  semesters,
  selectedSemester,
  onSemesterChange,
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold">Select a Semester</h3>
      <div className="grid grid-cols-3 gap-2 p-2">
        {semesters.map((semesterOption) => (
          <button
            key={semesterOption}
            onClick={() => onSemesterChange(semesterOption)}
            className={`rounded border p-2 transition duration-300 ${
              selectedSemester === semesterOption
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {semesterOption}
          </button>
        ))}
      </div>
    </div>
  );
};
