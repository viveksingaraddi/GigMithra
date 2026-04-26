import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Job, Application } from '@/types';
import { apiRequest } from '@/lib/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  jobs: Job[];
  applications: Application[];
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
  applyToJob: (application: Omit<Application, 'id' | 'appliedAt'>) => Promise<boolean>;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => Promise<void>;
  getJobById: (jobId: string) => Job | undefined;
  getApplicationsForJob: (jobId: string) => Application[];
  getApplicationsForWorker: (workerId: string) => Application[];
  getJobsForAuthoriser: (authoriserId: string) => Job[];
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const mapJob = (job: any): Job => ({
  id: job._id,
  authoriserId: job.authoriserId,
  authoriserName: job.authoriserName,
  companyName: job.companyName,
  eventType: job.eventType,
  workType: job.workType,
  workersRequired: job.workersRequired,
  paymentPerDay: job.paymentPerDay,
  date: job.date,
  startTime: job.startTime,
  endTime: job.endTime,
  location: job.location,
  description: job.description,
  createdAt: job.createdAt,
});

const mapApplication = (application: any): Application => ({
  id: application._id,
  jobId: application.jobId,
  workerId: application.workerId,
  workerName: application.workerName,
  workerPhone: application.workerPhone,
  workerLocation: application.workerLocation,
  status: application.status,
  appliedAt: application.createdAt,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const refreshData = async () => {
    try {
      const jobsResponse = await apiRequest<any[]>('/api/jobs');
      setJobs(jobsResponse.map(mapJob));

      if (!isAuthenticated || !user) {
        setApplications([]);
        return;
      }

      if (user.userType === 'worker') {
        const workerApplications = await apiRequest<any[]>('/api/applications/mine');
        setApplications(workerApplications.map(mapApplication));
      } else {
        const myJobs = await apiRequest<any[]>('/api/jobs/mine');
        const mappedMyJobs = myJobs.map(mapJob);
        let allApps: Application[] = [];

        for (const job of mappedMyJobs) {
          const jobApps = await apiRequest<any[]>(`/api/applications/job/${job.id}`);
          allApps = allApps.concat(jobApps.map(mapApplication));
        }
        setApplications(allApps);
      }
    } catch (_error) {
      setJobs([]);
      setApplications([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAuthenticated, user?.id, user?.userType]);

  const addJob = async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
    await apiRequest('/api/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    await refreshData();
  };

  const applyToJob = async (applicationData: Omit<Application, 'id' | 'appliedAt'>): Promise<boolean> => {
    try {
      await apiRequest('/api/applications', {
        method: 'POST',
        body: JSON.stringify({ jobId: applicationData.jobId }),
      });
      await refreshData();
      return true;
    } catch (_error) {
      return false;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    await apiRequest(`/api/applications/${applicationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    await refreshData();
  };

  const getJobById = (jobId: string) => jobs.find((job) => job.id === jobId);

  const getApplicationsForJob = (jobId: string) =>
    applications.filter((app) => app.jobId === jobId);

  const getApplicationsForWorker = (workerId: string) =>
    applications.filter((app) => app.workerId === workerId);

  const getJobsForAuthoriser = (authoriserId: string) =>
    jobs.filter((job) => job.authoriserId === authoriserId);

  return (
    <DataContext.Provider
      value={{
        jobs,
        applications,
        addJob,
        applyToJob,
        updateApplicationStatus,
        getJobById,
        getApplicationsForJob,
        getApplicationsForWorker,
        getJobsForAuthoriser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
