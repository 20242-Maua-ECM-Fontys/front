import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { useNotifications } from '@/components/ui/notifications';
import { useCreateStaffAvailability } from '@/features/time-registration/api/create-staff-availability';
import { useSchedules } from '@/features/time-registration/api/get-all-schedules';
import { CourseSelection } from '@/features/time-registration/components/course-selection';
import { CreateStaffAvailability } from '@/features/time-registration/components/create-staff-availability';
import { SemesterSelection } from '@/features/time-registration/components/semester-selection';
import { TimeslotSelection } from '@/features/time-registration/components/timeslot-selection';
import type {
  Availability,
  TimeSlot,
  WeekDays,
} from '@/features/time-registration/types/availability';
import {
  convertTimeStringToDecimal,
  generateCustomTimeIntervals,
} from '@/features/time-registration/utils/create-staff-availability';
import type { Schedule } from '@/types/api';

type DashboardContext = {
  setTitle: (title: string) => void;
};
const initialAvailability: Availability = {
  MON: [],
  TUE: [],
  WED: [],
  THU: [],
  FRI: [],
  SAT: [],
};

// eg: { Monday: ['08:00 - 08:10', '08:20 - 08:30'], Tuesday: ['08:00 - 08:10'] }
const formatAvailability = (
  availability: Availability,
): Partial<Record<WeekDays, { notEarlier: number; notLater: number }>> => {
  const formattedAvailability: Partial<
    Record<WeekDays, { notEarlier: number; notLater: number }>
  > = {};

  Object.keys(availability).forEach((day) => {
    const dayAvailability = availability[day as WeekDays];
    if (dayAvailability.length > 0) {
      dayAvailability.sort((a, b) => {
        const [hourA, minuteA] = a.split(' - ')[0].split(':').map(Number);
        const [hourB, minuteB] = b.split(' - ')[0].split(':').map(Number);
        return hourA - hourB || minuteA - minuteB;
      });

      const firstTime = dayAvailability[0].split(' - ')[0];
      const lastTime =
        dayAvailability[dayAvailability.length - 1].split(' - ')[1];

      const [firstHour, firstMinute] = firstTime.split(':').map(Number);
      const [lastHour, lastMinute] = lastTime.split(':').map(Number);

      const notEarlier = firstHour * 60 + firstMinute;
      const notLater = lastHour * 60 + lastMinute;

      formattedAvailability[day as WeekDays] = {
        notEarlier,
        notLater,
      };
    }
  });

  return formattedAvailability;
};

export const TimeRegistrationRoute = () => {
  const scheduleQuery = useSchedules({});

  const schedules = scheduleQuery?.data?.courses;
  const timeSlots = ['Morning', 'Afternoon', 'Evening'];

  const semesters = schedules
    ? Object.values(schedules)
        .flat()
        .filter((schedule) => schedule.schedulePeriod !== 'ANNUAL')
        .map((schedule) => {
          const { courseGrade, schedulePeriod } = schedule;
          const semester = `${courseGrade * 2 - (schedulePeriod === '1SEM' ? 1 : 0)}º Semester`;
          return semester;
        })
    : [];

  const uniqueSemesters = Array.from(new Set(semesters)).sort();

  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '07:40',
    end: '13:00',
  });

  const [step, setStep] = useState(1); // Active panel step
  const [period, setPeriod] = useState('');
  const [year, setYear] = useState<number>();
  const [semester, setSemester] = useState<string>();
  const [course, setCourse] = useState('');
  const [weekKey, setWeekKey] = useState(0);
  const [isEngineering, setIsEngineering] = useState(false);
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const { setTitle } = useOutletContext<DashboardContext>();

  const handleSemesterChange = (semesterOption: string) => {
    setSemester(semesterOption);
    const semesterMatch = semesterOption.match(/\d+/);
    const semesterNumber = semesterMatch ? parseInt(semesterMatch[0], 10) : 1;
    const calculatedYear = Math.ceil(semesterNumber / 2);
    setYear(calculatedYear);
    setStep(3);
  };

  const handleYearChange = (yearOption: number) => {
    setYear(yearOption);
    setStep(3);
  };

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
    const courseGrades = scheduleQuery?.data?.courses
      ? Object.values(scheduleQuery?.data?.courses[course])
          .flat()
          .map((schedule) => schedule.courseGrade)
      : [];
    const uniqueYears = Array.from(new Set(courseGrades))
      .map((grade) => `${grade}th Year`)
      .sort();
    setUniqueYears(uniqueYears);
    setStep(2);
  };

  const courses = Object.keys(schedules || {});

  useEffect(() => {
    setTitle('Register your time here'); // Set the desired title
    if (course) {
      setIsEngineering(course.includes('Engineering'));
    }
  }, [course]);

  const getScheduleId = () => {
    if (schedules && course && year) {
      const courseSchedules = schedules[course];
      if (courseSchedules) {
        const schedule = courseSchedules.find(
          (schedule: Schedule) => schedule.courseGrade === year,
        );
        return schedule?.scheduleId || '';
      }
    }
    return '';
  };

  const scheduleId = getScheduleId();

  const { addNotification } = useNotifications();
  const [availability, setAvailability] =
    useState<Availability>(initialAvailability);
  const [visibleDayIndex, setVisibleDayIndex] = useState<number>(0);

  const startHourDecimal = convertTimeStringToDecimal(timeSlot.start);
  const endHourDecimal = convertTimeStringToDecimal(timeSlot.end);

  const timeIntervals = generateCustomTimeIntervals(
    startHourDecimal,
    endHourDecimal,
  );

  const createStaffAvailabilityMutation = useCreateStaffAvailability({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Availability registered with success',
        });
      },
    },
  });

  const toggleTimeSlot = (day: WeekDays, timeSlot: TimeSlot) => {
    setAvailability((prevAvailability) => {
      const dayAvailability = prevAvailability[day];
      const newDayAvailability = dayAvailability.includes(timeSlot)
        ? dayAvailability.filter((slot) => slot !== timeSlot)
        : [...dayAvailability, timeSlot];
      return { ...prevAvailability, [day]: newDayAvailability };
    });
  };

  return (
    <ContentLayout title="Time Registration">
      <div>
        <div className="mb-6 flex items-center justify-center gap-4 sm:flex-wrap md:flex-nowrap md:justify-around">
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 p-6 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              course
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(1)}
          >
            <h4 className="text-lg font-semibold">Course</h4>
            {course && <p>{course}</p>}
          </div>

          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 p-6 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              semester || year
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(2)}
          >
            <h4 className="text-lg font-semibold">Semester</h4>
            {semester && <p>{semester}</p>}
          </div>

          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className={`mx-4 flex h-20 w-full flex-col items-center justify-center rounded-md border-2 p-6 text-center opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer ${
              period
                ? 'border-blue-500 bg-blue-100 hover:bg-blue-200'
                : 'border-transparent bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setStep(3)}
          >
            <h4 className="text-lg font-semibold">Time Slot</h4>
            {period && <p>{period}</p>}
          </div>

          {/* Submit button */}
          <div className="text-center">
            <button
              disabled={!course || (!semester && !year)}
              className={`rounded-md border-2 px-6 py-3 text-white transition-all duration-300 ${
                course && (semester || year)
                  ? 'border-green-500 bg-green-200 hover:bg-green-300'
                  : 'cursor-not-allowed border-gray-300 bg-gray-200'
              }`}
              onClick={() => {
                createStaffAvailabilityMutation.mutate({
                  scheduleId: scheduleId,
                  data: formatAvailability(availability),
                });
              }}
            >
              <p className="font-medium text-black">Submit</p>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Dynamic content */}
          {step === 1 && (
            <div className="col-span-3">
              <CourseSelection
                courses={courses}
                selectedCourse={course}
                onCourseChange={handleCourseChange}
              />
            </div>
          )}

          {step === 2 && (
            <div className="col-span-3">
              <SemesterSelection
                isEngineering={isEngineering}
                uniqueSemesters={uniqueSemesters}
                uniqueYears={uniqueYears}
                selectedSemester={semester}
                selectedYear={year}
                onYearChange={handleYearChange}
                onSemesterChange={handleSemesterChange}
              />
            </div>
          )}

          {step === 3 && (
            <div className="col-span-3">
              <TimeslotSelection
                timeSlots={timeSlots}
                selectedTimeSlot={period}
                onTimeSlotChange={handleTimeSlotChange}
              />
            </div>
          )}
        </div>
        {step === 3 && (
          <div className="mt-6">
            <h4 className="mb-4 text-2xl font-bold">Set Your Availability</h4>
            <CreateStaffAvailability
              key={weekKey}
              timeIntervals={timeIntervals}
              availability={availability}
              initialAvailability={initialAvailability}
              setVisibleDayIndex={setVisibleDayIndex}
              toggleTimeSlot={toggleTimeSlot}
              visibleDayIndex={visibleDayIndex}
            />
          </div>
        )}
      </div>
    </ContentLayout>
  );
};
