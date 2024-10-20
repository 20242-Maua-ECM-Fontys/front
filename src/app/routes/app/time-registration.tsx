import React, { useState } from 'react';

import WeekAvailability from '@/components/ui/week-availability';

export const TimeRegistrationRoute = () => {
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '07:40',
    end: '13:00',
  });

  const [period, setPeriod] = useState('Morning');
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [weekKey, setWeekKey] = useState(0);
  const [isEngineering, setIsEngineering] = useState(false);

  const handleTimeSlotChange = (slot: string) => {
    setPeriod(slot);
    switch (slot) {
      case 'Morning':
        setTimeSlot({ start: '07:40', end: '13:00' });
        break;
      case 'Afternoon':
        setTimeSlot({ start: '13:10', end: '18:30' });
        break;
      case 'Evening':
        setTimeSlot({ start: '19:00', end: '22:20' });
        break;
      default:
        break;
    }
    setWeekKey((prevKey) => prevKey + 1);
  };

  const handleCourseChange = (course: string) => {
    setCourse(course);
    const engineeringCourses = [
      'Computer Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Production Engineering',
      'Control and Automation Engineering',
    ];
    setIsEngineering(engineeringCourses.includes(course));
  };

  const handleSemesterChange = (semester: string) => {
    setSemester(semester);
  };

  const courses = [
    'Computer Science',
    'Information Technology',
    'Computer Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Production Engineering',
    'Control and Automation Engineering',
    'International Relations',
    'Business Administration',
    'Data Science and Artificial Intelligence',
    'Architecture and Urbanism',
  ];

  return (
    <div>
      <div className="flex h-screen items-center bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Time Registration</span>
          </h2>
          <p>Building your Schedules in a straightforward manner</p>
          <button
            className="mt-4 rounded bg-gray-200 px-4 py-2  transition duration-300 hover:bg-blue-400 hover:text-white"
            onClick={() =>
              document
                .getElementById('course-registration')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Register Now
          </button>
        </div>
      </div>

      <div
        className="mx-auto flex h-screen max-w-7xl items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
        id="course-registration"
      >
        <div className="flex flex-col items-center bg-white p-6">
          <h3 className="text-2xl font-bold">
            Which course are you registering for?
          </h3>
          <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3">
            {courses.map((courseOption) => (
              <button
                key={courseOption}
                onClick={() => {
                  handleCourseChange(courseOption);
                  document
                    .getElementById('period-possibilities')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`rounded border p-4 transition duration-300 ${
                  course === courseOption
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200'
                } hover:bg-blue-400 hover:text-white`}
              >
                {courseOption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
        id="period-possibilities"
      >
        <h3 className="text-2xl font-bold">
          Which period are you registering for?
        </h3>
        <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3">
          {isEngineering ? (
            <>
              {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map(
                (year) => (
                  <button
                    key={year}
                    onClick={() => {
                      handleSemesterChange(year);
                      document
                        .getElementById('table-possibilities')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`rounded border p-4 transition duration-300 ${
                      semester === year
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    } hover:bg-blue-400 hover:text-white`}
                  >
                    {year}
                  </button>
                ),
              )}
            </>
          ) : (
            <>
              {[
                '1st Semester',
                '2nd Semester',
                '3rd Semester',
                '4th Semester',
                '5th Semester',
                '6th Semester',
                '7th Semester',
                '8th Semester',
                '9th Semester',
                '10th Semester',
              ].map((semesterOption) => (
                <button
                  key={semesterOption}
                  onClick={() => {
                    handleSemesterChange(semesterOption);
                    document
                      .getElementById('table-possibilities')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded border p-4 transition duration-300 ${
                    semester === semesterOption
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  } hover:bg-blue-400 hover:text-white`}
                >
                  {semesterOption}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div
        className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
        id="table-possibilities"
      >
        <h3 className="mb-4 text-center text-xl font-bold">
          Set Your Availability
        </h3>
        <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
          <button
            onClick={() => {
              handleTimeSlotChange('Morning');
              document
                .getElementById('table-possibilities')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`mx-auto rounded px-4 py-2 transition duration-300 ${
              period === 'Morning'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            } hover:bg-blue-500 hover:text-white`}
          >
            Morning
          </button>

          <button
            onClick={() => {
              handleTimeSlotChange('Afternoon');
              document
                .getElementById('table-possibilities')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`mx-auto rounded px-4 py-2 transition duration-300 ${
              period === 'Afternoon'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            } hover:bg-blue-500 hover:text-white`}
          >
            <p>Afternoon</p>
          </button>
          <button
            onClick={() => {
              handleTimeSlotChange('Evening');
              document
                .getElementById('table-possibilities')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`mx-auto rounded px-4 py-2 transition duration-300 ${
              period === 'Evening'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black'
            } hover:bg-blue-500 hover:text-white`}
          >
            <p>Evening</p>
          </button>
        </div>
        <WeekAvailability
          startHour={timeSlot.start}
          endHour={timeSlot.end}
          key={weekKey}
        />
      </div>
    </div>
  );
};
