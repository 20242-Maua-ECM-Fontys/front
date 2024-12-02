import React from 'react';

type Props = {
  courses: string[];
  selectedCourse: string;
  onCourseChange: (course: string) => void;
};

export const CourseSelectionPanel: React.FC<Props> = ({
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
            className={`h-16 rounded border font-medium transition duration-300 ${
              selectedCourse === courseOption
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {courseOption}
          </button>
        ))}
      </div>
    </div>
  );
};
