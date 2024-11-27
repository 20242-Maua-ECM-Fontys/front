export type User = {
  userId: number;
  email: string;
  role: 'STAFF' | 'COORDINATOR' | 'PROFESSOR' | 'ADMIN';
};

export type Availability = {
  startTime: number;
  endTime: number;
  weekDay: string;
};
