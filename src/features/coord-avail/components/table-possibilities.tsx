import React from 'react';

import { WeekAvailabilityTable } from '@/features/coord-avail/components/week-availability-update';

interface TablePossibilitiesProps {
  professorUserId: string | number | undefined;
  selectedProfessor: any;
}

export const TablePossibilities = ({
  professorUserId,
  selectedProfessor,
}: TablePossibilitiesProps) => (
  <WeekAvailabilityTable
    startHour={'07:40'}
    endHour={'22:30'}
    initialAvailability={selectedProfessor?.availabilities || []}
    key={Math.random()}
    userId={typeof professorUserId === 'number' ? professorUserId : 0}
  />
);
