export type User = {
  firstName: string;
  lastName: string;
  email: string;
  role: 'STAFF' | 'COORDINATOR' | 'PROFESSOR';
};

export type Schedule = {
  scheduleId: string;
  courseGrade: number;
  schedulePeriod: 'ANNUAL' | '1SEM';
};

export type Courses = {
  [courseName: string]: Schedule[];
};
