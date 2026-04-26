import { Job, EVENT_TYPES, WORK_TYPES } from '@/types';
import { Calendar, Clock, MapPin, Users, IndianRupee, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  applicationStatus?: 'pending' | 'accepted' | 'rejected' | null;
}

export default function JobCard({ job, showApplyButton = true, applicationStatus = null }: JobCardProps) {
  const { user } = useAuth();
  const { applyToJob } = useData();

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }

    const success = await applyToJob({
      jobId: job.id,
      workerId: user.id,
      workerName: user.name,
      workerPhone: user.phone,
      workerLocation: user.location,
      status: 'pending',
    });

    if (success) {
      toast.success('Application submitted successfully!');
    } else {
      toast.error('You have already applied for this job');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getEventTypeColor = (eventType: Job['eventType']) => {
    const colors = {
      wedding: 'bg-pink-100 text-pink-700',
      reception: 'bg-purple-100 text-purple-700',
      party: 'bg-blue-100 text-blue-700',
      temple_function: 'bg-orange-100 text-orange-700',
      corporate: 'bg-slate-100 text-slate-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[eventType];
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-md card-hover border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(job.eventType)}`}>
            {EVENT_TYPES[job.eventType]}
          </span>
          <h3 className="text-lg font-semibold mt-2 text-foreground">
            {WORK_TYPES[job.workType]}
          </h3>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-primary font-bold text-xl">
            <IndianRupee className="w-5 h-5" />
            {job.paymentPerDay}
          </div>
          <span className="text-xs text-muted-foreground">per day</span>
        </div>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{job.companyName}</p>
          <p className="text-xs text-muted-foreground">by {job.authoriserName}</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{formatDate(job.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{job.startTime} - {job.endTime}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4 text-primary" />
          <span>{job.workersRequired} workers needed</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {job.description}
      </p>

      {/* Action */}
      {applicationStatus ? (
        <div className={`text-center py-2 rounded-lg font-medium ${
          applicationStatus === 'pending' ? 'status-pending' :
          applicationStatus === 'accepted' ? 'status-accepted' :
          'status-rejected'
        }`}>
          {applicationStatus === 'pending' && '⏳ Application Pending'}
          {applicationStatus === 'accepted' && '✓ Application Accepted'}
          {applicationStatus === 'rejected' && '✗ Application Rejected'}
        </div>
      ) : showApplyButton && user?.userType === 'worker' ? (
        <Button onClick={handleApply} className="w-full">
          Apply Now
        </Button>
      ) : null}
    </div>
  );
}
