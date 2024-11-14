export type WeekDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export type TimeSlot = string;

export interface Availability {
  Monday: TimeSlot[];
  Tuesday: TimeSlot[];
  Wednesday: TimeSlot[];
  Thursday: TimeSlot[];
  Friday: TimeSlot[];
  Saturday: TimeSlot[];
}

export interface WeekAvailabilityTableProps {
  startHour: string;
  endHour: string;
  resetAvailability?: boolean;
}
