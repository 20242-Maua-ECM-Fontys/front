export type WeekDays = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

export type TimeSlot = string;

export interface Availability {
  MON: TimeSlot[];
  TUE: TimeSlot[];
  WED: TimeSlot[];
  THU: TimeSlot[];
  FRI: TimeSlot[];
  SAT: TimeSlot[];
}
