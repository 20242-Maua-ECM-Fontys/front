import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import { CourseSelectionPanel } from '@/components/time-registration/CourseSelectionPanel';
import { SemesterSelectionPanel } from '@/components/time-registration/SemesterSelectionPanel';
import { TimeSlotSelectionPanel } from '@/components/time-registration/TimeSlotSelectionPanel';
import { WeekAvailabilityTable } from '@/features/time-registration/components/week-availability';

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
    setTitle('Time Registration');
  }, [setTitle]);

  const [step, setStep] = useState(1); // Active panel step
  const [period, setPeriod] = useState('Morning');
  const [semester, setSemester] = useState('');
  const [course, setCourse] = useState('');
  const [isEngineering, setIsEngineering] = useState(false);

  const handleTimeSlotChange = (slot: string) => {
    setPeriod(slot);
    setTimeSlot(
      slot === 'Morning'
        ? { start: '07:40', end: '13:00' }
        : slot === 'Afternoon'
          ? { start: '13:10', end: '18:30' }
          : { start: '19:00', end: '22:20' },
    );
  };

  const handleCourseChange = (selectedCourse: string) => {
    setCourse(selectedCourse);
    setIsEngineering(
      [
        'Computer Engineering',
        'Electrical Engineering',
        'Mechanical Engineering',
        'Civil Engineering',
        'Chemical Engineering',
        'Production Engineering',
        'Control and Automation Engineering',
      ].includes(selectedCourse),
    );
    setStep(2);
  };

  const handleSemesterChange = (selectedSemester: string) => {
    setSemester(selectedSemester);
    setStep(3);
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

  const semesters = isEngineering
    ? ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']
    : [
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
    ];

  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  return (
    <div className="mx-auto w-full max-w-7xl pt-6">
      <div className="flex flex-wrap gap-6">
        {/* First Panel - Big */}
        <div
          className={`rounded-2xl border p-3 shadow-sm overflow-clip ${
            step === 1
              ? 'h-[20rem] w-full border-blue-400 bg-blue-100'
              : 'h-24 w-1/4 border-gray-300 bg-gray-100 hover:bg-blue-50'
          } cursor-pointer`}
          onClick={() => setStep(1)}
        >
          <CourseSelectionPanel
            courses={courses}
            selectedCourse={course}
            onCourseChange={handleCourseChange}
          />
        </div>

        {/* Second Panel - Small */}
        <div
          className={`rounded-2xl border p-3 shadow-sm overflow-clip ${
            step === 2
              ? 'h-[20rem] w-full border-blue-400 bg-blue-100'
              : 'h-24 w-1/4 border-gray-300 bg-gray-100 hover:bg-blue-50'
          } cursor-pointer`}
          onClick={() => step >= 1 && setStep(2)}
        >
          <SemesterSelectionPanel
            semesters={semesters}
            selectedSemester={semester}
            onSemesterChange={handleSemesterChange}
          />
        </div>

        {/* Third Panel - Small */}
        <div
          className={`rounded-2xl border p-3 shadow-sm overflow-clip ${
            step === 3
              ? 'h-[28rem] w-full border-blue-400 bg-blue-100'
              : 'h-24 w-1/4 border-gray-300 bg-gray-100 hover:bg-blue-50'
          } cursor-pointer`}
          onClick={() => step >= 2 && setStep(3)}
        >
          <TimeSlotSelectionPanel
            timeSlots={timeSlots}
            selectedTimeSlot={period}
            onTimeSlotChange={handleTimeSlotChange}
          />
          {step === 3 && (
            <div className="mt-6">
              <h4 className="mb-4 text-2xl font-bold">Set Your Availability</h4>
              <WeekAvailabilityTable
                startHour={timeSlot.start}
                endHour={timeSlot.end}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
