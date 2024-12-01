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

export type Professor = {
  name: string;
  email: string;
  availabilities: Availability[];
  suitabilities: {
    codeSubject: string;
    subjectName: string;
  }[];
};

export type Professors = {
  [key: number]: Professor;
};

export type Subject = {
  codeSubject: string;
  subjectName: string;
  period: string;
};
