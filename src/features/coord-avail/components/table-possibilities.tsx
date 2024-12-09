import React from 'react';
import { WeekAvailabilityTable } from '@/features/coord-avail/components/week-availability-update';
import { Availability } from '@/types/api';

interface TablePossibilitiesProps {
  professorUserId: string | number | undefined;
  selectedProfessor: any;
  availabilities: Availability[];
  setAvailabilities: React.Dispatch<React.SetStateAction<Availability[]>>;
}

export const TablePossibilities = ({
  professorUserId,
  selectedProfessor,
  availabilities,
  setAvailabilities,
}: TablePossibilitiesProps) => (
  <WeekAvailabilityTable
    startHour={'07:40'}
    endHour={'22:30'}
    initialAvailability={selectedProfessor?.availabilities || []}
    key={Math.random()}
    userId={professorUserId ?? 0}
    availabilities={availabilities}
    setAvailabilities={setAvailabilities}
  />
);
