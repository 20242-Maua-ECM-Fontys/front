import { WeekAvailabilityTable } from '@/features/coord-avail/components/week-availability-update';
import { useEffect, useState } from 'react';
import { useAvailByProfessor } from '@/features/teacher-avail/api/get-avail-by-professor';
import type { Availability } from '@/types/api';

export const TablePossibilities = ({ userId }: { userId?: number }) => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isAvailLoaded, setIsAvailLoaded] = useState(false);
  const [weekKey] = useState(0);

  const availabilitiesByProfessorQuery = useAvailByProfessor({
    userId: userId ?? 0,
  });

  useEffect(() => {
    if (userId) {
      availabilitiesByProfessorQuery.refetch();
      if (availabilitiesByProfessorQuery.isLoading) return;

      setAvailabilities(
        availabilitiesByProfessorQuery.data?.availabilities ?? [],
      );
      setIsAvailLoaded(true);
    }
  }, [userId, availabilitiesByProfessorQuery]);

  return (
    <div
      className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center text-center sm:px-6 md:mt-0 lg:px-8"
      id="table-possibilities"
    >
      {isAvailLoaded ? (
        <WeekAvailabilityTable
          startHour={'07:40'}
          endHour={'22:30'}
          key={weekKey}
          initialAvailability={availabilities}
          userId={userId ?? 0}
        />
      ) : (
        <div className="flex h-[49vh] items-center justify-center">
          <div className="size-32 animate-spin rounded-full border-y-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
};
