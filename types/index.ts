export type TimesheetStatus = 'COMPLETED' | 'INCOMPLETE' | 'MISSING';

export interface Timesheet {
  id: string;
  weekNumber: number;
  dateRange: string;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
}

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string;
  projectName: string;
  workType: string;
  description: string;
  hours: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
