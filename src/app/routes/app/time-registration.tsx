import axios from 'axios';
import { useEffect, useState } from 'react';

import { WeekAvailabilityTable } from '@/components/ui/week-availability-update';
import { toast } from '@/hooks/use-toast';

export const TimeRegistrationRoute = () => {
  interface Availability {
    startTime: number; // em minutos
    endTime: number; // em minutos
    weekDay: string;
  }
  interface weekDayAvailability {
    MON: {
      notEarlier: number;
      notLater: number;
    };
    TUE: {
      notEarlier: number;
      notLater: number;
    };
    WED: {
      notEarlier: number;
      notLater: number;
    };
    THU: {
      notEarlier: number;
      notLater: number;
    };
    FRI: {
      notEarlier: number;
      notLater: number;
    };
    SAT: {
      notEarlier: number;
      notLater: number;
    };
  }
  const [courses, setCourses] = useState<string[]>([]);
  const [coursesPeriods, setCoursesPeriods] = useState<any>({});
  const [period, setPeriod] = useState('Morning');

  const [courseId, setCourseId] = useState('');
  const [courseType, setCourseType] = useState('');
  const [loading, setLoading] = useState(true);
  const [weekKey, setWeekKey] = useState(0);
  const [courseGrade, setCourseGrade] = useState(0);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [timeSlot, setTimeSlot] = useState<{ start: string; end: string }>({
    start: '07:40',
    end: '13:00',
  });

  const getCourseType = (course: string) => {
    // check in the "schedulePeriod" key of the course object
    // if the value is "ANNUAL" return "ANNUAL"
    const courseSchedules = coursesPeriods[course];
    const courseType = courseSchedules[0].schedulePeriod;
    return courseType;
  };

  const handlegetCourses = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_API_URL + 'get_all_schedules',
      );
      setCourses(Object.keys(response.data.courses));
      setCoursesPeriods(response.data.courses);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
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
    setCourseId(courseToCourseId(course));
    setCourseType(getCourseType(course));
  };

  const handlePeriodChange = (period: string) => {
    setPeriod(period);
    switch (period) {
      case '1st Year':
        setCourseGrade(1);
        break;
      case '2nd Year':
        setCourseGrade(2);
        break;
      case '3rd Year':
        setCourseGrade(3);
        break;
      case '4th Year':
        setCourseGrade(4);
        break;
      case '5th Year':
        setCourseGrade(5);
        break;
      case '1st Semester':
        setCourseGrade(1);
        break;
      case '2nd Semester':
        setCourseGrade(2);
        break;
      default:
        break;
    }
  };

  const handleAvailabilityChange = (newAvailability: Availability[]) => {
    setAvailability(newAvailability);
  };

  const courseToCourseId = (course: string) => {
    switch (course) {
      case 'Compute Engineering':
        return 'CM';
      case 'Cience Coputing':
        return 'CIC';
      default:
        return '';
    }
  };

  const registerPossibility = async () => {
    const courseTypeRequest =
      courseType === 'ANNUAL' ? '2S' : courseType === '1SEM' ? '1S' : '2S';
    const current_year = new Date().getFullYear();
    const weekDaysAvailability: weekDayAvailability = {
      MON: {
        notEarlier: 0,
        notLater: 0,
      },
      TUE: {
        notEarlier: 0,
        notLater: 0,
      },
      WED: {
        notEarlier: 0,
        notLater: 0,
      },
      THU: {
        notEarlier: 0,
        notLater: 0,
      },
      FRI: {
        notEarlier: 0,
        notLater: 0,
      },
      SAT: {
        notEarlier: 0,
        notLater: 0,
      },
    };

    //PEGAR OS VALORES MAXIMOS E MINIMOS DE CADA DIA DA SEMANA
    availability.forEach((slot) => {
      const weekDay = slot.weekDay as keyof weekDayAvailability;
      const startTime = slot.startTime;
      const endTime = slot.endTime;

      if (weekDaysAvailability[weekDay].notEarlier === 0) {
        weekDaysAvailability[weekDay].notEarlier = startTime;
      } else {
        weekDaysAvailability[weekDay].notEarlier = Math.min(
          weekDaysAvailability[weekDay].notEarlier,
          startTime,
        );
      }

      weekDaysAvailability[weekDay].notLater = Math.max(
        weekDaysAvailability[weekDay].notLater,
        endTime,
      );
    });

    const request = {
      //2S-4CM-D5@2024(SCS)
      scheduleId: `${courseTypeRequest}-${courseGrade}${courseId}-D5@${current_year}(SCS)`,
      availability: weekDaysAvailability,
    };

    try {
      await axios.post(
        import.meta.env.VITE_APP_API_URL + 'create_possibility',
        request,
      );
      toast({
        title: 'Success',
        description: 'Possibility registered successfully',
      });
      // console.log('success');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'An error occurred while trying to register your possibility',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    handlegetCourses();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <div className="flex h-screen items-center">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="p-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">Time Registration</span>
          </h2>
          <p>Building your Schedules in a straightforward manner</p>
          <button
            className="mt-4 rounded bg-gray-200 px-4 py-2 transition duration-300 hover:bg-blue-400 hover:text-white"
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
        {loading ? (
          <div className="flex items-center">
            <div className="size-12 animate-spin rounded-full border-t-4 border-solid border-blue-500"></div>
            <p className="ml-4 text-lg font-bold">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center p-6">
            <h3 className="text-2xl font-bold">
              Which course are you registering for?
            </h3>
            <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3">
              {courses.map((course) => {
                const courseOption = course;
                return (
                  <button
                    key={courseOption}
                    onClick={() => {
                      handleCourseChange(courseOption);
                      document
                        .getElementById('period-possibilities')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`rounded border bg-gray-200 p-4 transition duration-300 hover:bg-blue-400 hover:text-white`}
                  >
                    {courseOption}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div
        className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
        id="period-possibilities"
      >
        <h3 className="text-2xl font-bold">
          Which period are you registering for?
        </h3>
        <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-3">
          {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'].map(
            (year) => (
              <button
                key={year}
                onClick={() => {
                  handlePeriodChange(year);
                  courseType === 'ANNUAL'
                    ? document
                        .getElementById('table-possibilities')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    : document
                        .getElementById('semester-possibilities')
                        ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`rounded border p-4 transition duration-300 ${
                  period === year ? 'bg-blue-500 text-white' : 'bg-gray-200'
                } hover:bg-blue-400 hover:text-white`}
              >
                {year}
              </button>
            ),
          )}
        </div>
      </div>

      {courseType === 'ANNUAL' ? null : (
        <div
          className="mx-auto flex h-screen max-w-7xl flex-col items-center justify-center p-4 text-center sm:px-6 lg:px-8 lg:py-10"
          id="semester-possibilities"
        >
          <h3 className="text-2xl font-bold">
            Which semester are you registering for?
          </h3>
          <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-1 md:grid-cols-2">
            <>
              {['1st Semester', '2nd Semester'].map((semesterOption) => (
                <button
                  key={semesterOption}
                  onClick={() => {
                    handlePeriodChange(semesterOption);
                    document
                      .getElementById('table-possibilities')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`rounded border p-4 transition duration-300 ${
                    period === semesterOption
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200'
                  } hover:bg-blue-400 hover:text-white`}
                >
                  {semesterOption}
                </button>
              ))}
            </>
          </div>
        </div>
      )}
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
        <WeekAvailabilityTable
          startHour={timeSlot.start}
          endHour={timeSlot.end}
          initialAvailability={availability}
          key={weekKey}
          onAvailabilityChange={handleAvailabilityChange}
        />
        <button
          onClick={() => {
            registerPossibility();
          }}
          className={`rounded border bg-gray-200 p-3 text-black transition duration-300 hover:bg-blue-400 hover:text-white`}
        >
          Register
        </button>
      </div>
    </div>
  );
};
