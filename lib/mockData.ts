import { Timesheet, TimesheetEntry, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'saqib@example.com',
    name: 'Saqib',
  },
  {
    id: '2',
    email: 'test@example.com',
    name: 'Test User',
  },
];

export const mockTimesheets: Timesheet[] = [
  {
    id: '1',
    weekNumber: 1,
    dateRange: '1 - 5 January, 2024',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    status: 'COMPLETED',
    totalHours: 40,
  },
  {
    id: '2',
    weekNumber: 2,
    dateRange: '8 - 12 January, 2024',
    startDate: '2024-01-08',
    endDate: '2024-01-12',
    status: 'COMPLETED',
    totalHours: 40,
  },
  {
    id: '3',
    weekNumber: 3,
    dateRange: '15 - 19 January, 2024',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    status: 'INCOMPLETE',
    totalHours: 32,
  },
  {
    id: '4',
    weekNumber: 4,
    dateRange: '22 - 26 January, 2024',
    startDate: '2024-01-22',
    endDate: '2024-01-26',
    status: 'COMPLETED',
    totalHours: 40,
  },
  {
    id: '5',
    weekNumber: 5,
    dateRange: '28 January - 1 February, 2024',
    startDate: '2024-01-28',
    endDate: '2024-02-01',
    status: 'MISSING',
    totalHours: 0,
  },
];

export const mockTimesheetEntries: Record<string, TimesheetEntry[]> = {
  '4': [
    {
      id: 'e1',
      timesheetId: '4',
      date: '2024-01-21',
      projectName: 'Homepage Development',
      workType: 'Development',
      description: 'Implemented responsive navigation',
      hours: 4,
    },
    {
      id: 'e2',
      timesheetId: '4',
      date: '2024-01-21',
      projectName: 'Homepage Development',
      workType: 'Development',
      description: 'Fixed header styling issues',
      hours: 4,
    },
    {
      id: 'e3',
      timesheetId: '4',
      date: '2024-01-22',
      projectName: 'Homepage Development',
      workType: 'Development',
      description: 'Created hero section component',
      hours: 4,
    },
    {
      id: 'e4',
      timesheetId: '4',
      date: '2024-01-22',
      projectName: 'Homepage Development',
      workType: 'Bug fixes',
      description: 'Resolved mobile menu issues',
      hours: 4,
    },
    {
      id: 'e5',
      timesheetId: '4',
      date: '2024-01-22',
      projectName: 'Homepage Development',
      workType: 'Development',
      description: 'Added footer component',
      hours: 4,
    },
    {
      id: 'e6',
      timesheetId: '4',
      date: '2024-01-23',
      projectName: 'Homepage Development',
      workType: 'Development',
      description: 'Implemented contact form',
      hours: 4,
    },
    {
      id: 'e7',
      timesheetId: '4',
      date: '2024-01-23',
      projectName: 'Homepage Development',
      workType: 'Testing',
      description: 'Cross-browser testing',
      hours: 4,
    },
    {
      id: 'e8',
      timesheetId: '4',
      date: '2024-01-23',
      projectName: 'Homepage Development',
      workType: 'Development',
      description: 'Performance optimization',
      hours: 4,
    },
  ],
};

export const projectNames = [
  'Homepage Development',
  'Mobile App Development',
  'API Integration',
  'Database Migration',
  'UI/UX Design',
  'Client Meeting',
  'Code Review',
];

export const workTypes = [
  'Development',
  'Bug fixes',
  'Testing',
  'Code Review',
  'Meeting',
  'Documentation',
  'Research',
];
