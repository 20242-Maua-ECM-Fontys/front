import React, { useState, useEffect } from 'react';

import { WeekAvailabilityTable } from '@/features/time-registration/components/week-availability';
import { useOutletContext } from 'react-router';

type DashboardContext = {
  setTitle: (title: string) => void;
};
export const NewTimeRegistrationRoute = () => {
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '07:40',
    end: '13:00',
  });
  const { setTitle } = useOutletContext<DashboardContext>();

  useEffect(() => {
    setTitle('Time Registration'); // Set the desired title
  }, [setTitle]);

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
  const [transitioning, setTransitioning] = useState(false);

  const handleCourseChange = (course: string) => {
    setTransitioning(true);  // Start transition
    setCourse(course);

    // Wait for the transition to end before updating the year options
    setTimeout(() => {
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
      setTransitioning(false);  // End transition
    }, 100);  // Match the duration of your transition effect
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
      <div className="mx-auto max-w-7xl pt-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 sm:grid-cols-1">
          <div className="rounded-2xl border p-3 bg-white hover:bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-300">
            <p className="text-sm text-gray-600 ">
              <div
                className="mx-auto flex max-w-7xl items-center justify-center text-center"
                id="course-registration"
              >
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold text-black">
                    Which course are you registering for?
                  </h3>
                  <div className="grid gap-2 p-2 grid-cols-2">
                    {courses.map((courseOption) => (
                      <button
                        key={courseOption}
                        onClick={() => {
                          handleCourseChange(courseOption);
                          document
                            .getElementById('period-possibilities')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`rounded border p-2 font-medium transition duration-300 ${
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
            </p>
          </div>
          <div className="rounded-2xl border p-3 bg-white hover:bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-300">
            <div
              className="mx-auto flex max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6"
              id="period-possibilities"
            >
              <h3 className="text-2xl font-bold">
                Which period are you registering for?
              </h3>

              {/* Smooth transition of year/semester buttons */}
              <div
                className={`grid grid-cols-2 gap-5 p-6 sm:grid-cols-3 lg:grid-cols-2 transition-all duration-300 ease-in-out ${
                  transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >                {isEngineering ? (
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
                          className={`rounded border p-2 transition duration-300 ${
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
                        className={`rounded border h-12 px-2 transition duration-300 ${
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
          </div>

          <div className="rounded-2xl border p-3 bg-white hover:bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-300">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">Set Your Availability</h4>
            <div className="mx-auto flex flex-col items-center justify-center text-center">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
                {/* Morning Button */}
                <button
                  onClick={() => {
                    handleTimeSlotChange('Morning');
                    document
                      .getElementById('table-possibilities')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded-lg px-1 py-3 transition duration-300 ${
                    period === 'Morning' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  } hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105`}
                >
                  Morning
                </button>

                {/* Afternoon Button */}
                <button
                  onClick={() => {
                    handleTimeSlotChange('Afternoon');
                    document
                      .getElementById('table-possibilities')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded-lg px-1 py-3 transition duration-300 ${
                    period === 'Afternoon' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  } hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105`}
                >
                  Afternoon
                </button>

                {/* Evening Button */}
                <button
                  onClick={() => {
                    handleTimeSlotChange('Evening');
                    document
                      .getElementById('table-possibilities')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded-lg px-1 py-3 transition duration-300 ${
                    period === 'Evening' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                  } hover:bg-blue-500 hover:text-white shadow-md hover:shadow-lg transform hover:scale-105`}
                >
                  Evening
                </button>
              </div>
              {/* Availability Table */}
              <WeekAvailabilityTable
                startHour={timeSlot.start}
                endHour={timeSlot.end}
                key={weekKey}
              />
            </div>
          </div>

        </div>
      </div>


    </div>
  );
};
