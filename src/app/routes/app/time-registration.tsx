import React, { useState } from 'react';

import WeekAvailability from '@/components/ui/week-availability';

export const TimeRegistrationRoute = () => {
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '07:40',
    end: '13:00',
  });

  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [weekKey, setWeekKey] = useState(0);
  const [isEngineering, setIsEngineering] = useState(false);

  const handleTimeSlotChange = (slot: string) => {
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

  const handleSemesterChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSemester(event.target.value);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCourse(event.target.value);
    const engineeringCourses = [
      'Computer Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Production Engineering',
      'Control and Automation Engineering',
    ];
    setIsEngineering(engineeringCourses.includes(event.target.value));
  };

  return (
    <div>
      <div className="flex h-screen items-center bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Time Registration</span>
          </h2>
          <p>Building your Schedules in a straightforward manner</p>
          <button
            className="mt-4 rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
            onClick={() =>
              document
                .getElementById('time-registration')
                ?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            Register Now
          </button>
        </div>
      </div>

      <div
        className="mx-auto flex h-screen max-w-7xl items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
        id="time-registration"
      >
        <div className="flex flex-col items-center bg-white p-6">
          <h3 className="text-2xl font-bold">
            Which semester are you registering for?
          </h3>
          <div className="flex flex-col items-center p-6">
            <label htmlFor="course" className="mr-2 pb-2 pt-4">
              Select Course:
            </label>
            <select
              id="course"
              value={course}
              onChange={handleCourseChange}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Select</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="Computer Engineering">Computer Engineering</option>
              <option value="Electrical Engineering">
                Electrical Engineering
              </option>
              <option value="Mechanical Engineering">
                Mechanical Engineering
              </option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Chemical Engineering">Chemical Engineering</option>
              <option value="Production Engineering">
                Production Engineering
              </option>
              <option value="Control and Automation Engineering">
                Control and Automation Engineering
              </option>
              <option value="International Relations">
                International Relations
              </option>
              <option value="Business Administration">
                Business Administration
              </option>
              <option value="Data Science and Artificial Intelligence">
                Data Science and Artificial Intelligence
              </option>
              <option value="Architecture and Urbanism">
                Architecture and Urbanism
              </option>
            </select>
            <label htmlFor="semester" className="mr-2 pb-2 pt-4">
              {isEngineering ? 'Select Year:' : 'Select Semester:'}
            </label>
            <select
              id="semester"
              value={semester}
              onChange={handleSemesterChange}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Select</option>
              {isEngineering ? (
                <>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="5th">5th Year</option>
                </>
              ) : (
                <>
                  <option value="1st">1st Semester</option>
                  <option value="2nd">2nd Semester</option>
                  <option value="3rd">3rd Semester</option>
                  <option value="4th">4th Semester</option>
                  <option value="5th">5th Semester</option>
                  <option value="6th">6th Semester</option>
                  <option value="7th">7th Semester</option>
                  <option value="8th">8th Semester</option>
                  <option value="9th">9th Semester</option>
                  <option value="10th">10th Semester</option>
                </>
              )}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-3">
            <button
              onClick={() => {
                handleTimeSlotChange('Morning');
                document
                  .getElementById('table-possibilities')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mx-auto rounded bg-gray-400 px-4 py-2 text-white hover:bg-blue-700 hover:text-gray-100"
            >
              <p>Morning</p>
            </button>
            <button
              onClick={() => {
                handleTimeSlotChange('Afternoon');
                document
                  .getElementById('table-possibilities')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mx-auto rounded bg-gray-400 px-4 py-2 text-white hover:bg-blue-700 hover:text-gray-100"
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
              className="mx-auto rounded bg-gray-400 px-4 py-2 text-white hover:bg-blue-700 hover:text-gray-100"
            >
              <p>Evening</p>
            </button>
          </div>
        </div>
      </div>

      <div
        className="mx-auto flex h-screen max-w-7xl items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
        id="table-possibilities"
      >
        <WeekAvailability
          startHour={timeSlot.start}
          endHour={timeSlot.end}
          key={weekKey}
        />
      </div>
    </div>
  );
};
