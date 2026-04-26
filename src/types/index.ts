export type UserType = 'worker' | 'authoriser';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  location: string;
  profilePhoto?: string;
  userType: UserType;
  companyName?: string; // For authorisers
  createdAt: string;
}

export interface Job {
  id: string;
  authoriserId: string;
  authoriserName: string;
  companyName: string;
  eventType: 'wedding' | 'reception' | 'party' | 'temple_function' | 'corporate' | 'other';
  workType: 'serving' | 'cleaning' | 'table_setup' | 'water_service' | 'cooking_assist' | 'other';
  workersRequired: number;
  paymentPerDay: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerLocation: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
}

export const EVENT_TYPES: Record<Job['eventType'], string> = {
  wedding: 'Wedding',
  reception: 'Reception',
  party: 'Birthday Party',
  temple_function: 'Temple Function',
  corporate: 'Corporate Event',
  other: 'Other Event',
};

export const WORK_TYPES: Record<Job['workType'], string> = {
  serving: 'Serving Food',
  cleaning: 'Cleaning',
  table_setup: 'Table Setup',
  water_service: 'Water Service',
  cooking_assist: 'Cooking Assistant',
  other: 'Other Work',
};
