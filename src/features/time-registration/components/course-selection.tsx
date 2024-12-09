import React from 'react';

type Props = {
  courses: string[];
  selectedCourse: string;
  onCourseChange: (course: string) => void;
};

export const CourseSelection: React.FC<Props> = ({
  courses,
  selectedCourse,
  onCourseChange,
}) => {
  return (
    <div>
      <h3 className="text-2xl font-bold">Select a Course</h3>
      <div className="grid grid-cols-3 gap-2 p-2">
        {courses.map((courseOption) => (
          <button
            key={courseOption}
            onClick={() => onCourseChange(courseOption)}
            className={`rounded border p-2 transition duration-300 hover:cursor-pointer ${
              selectedCourse === courseOption
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {courseOption}
          </button>
        ))}
      </div>
    </div>
  );
};
