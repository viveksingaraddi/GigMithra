import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, FileText, Clock, CheckCircle2, XCircle, Briefcase } from 'lucide-react';
import { EVENT_TYPES, WORK_TYPES } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyApplications() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { getApplicationsForWorker, getJobById } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || user?.userType !== 'worker') {
      navigate('/worker-login');
    }
  }, [isAuthenticated, user, navigate, isAuthLoading]);

  if (isAuthLoading || !user) return null;

  const applications = getApplicationsForWorker(user.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'accepted':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link 
            to="/worker-dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">My Applications</h1>
              <p className="text-muted-foreground">{applications.length} total applications</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                {applications.filter(a => a.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-500">Pending</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {applications.filter(a => a.status === 'accepted').length}
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">Accepted</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                {applications.filter(a => a.status === 'rejected').length}
              </p>
              <p className="text-sm text-red-600 dark:text-red-500">Rejected</p>
            </div>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => {
                const job = getJobById(application.jobId);
                if (!job) return null;

                return (
                  <div 
                    key={application.id}
                    className="bg-card rounded-2xl p-6 border border-border"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {EVENT_TYPES[job.eventType]}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === 'pending' ? 'status-pending' :
                            application.status === 'accepted' ? 'status-accepted' :
                            'status-rejected'
                          }`}>
                            {application.status === 'pending' && '⏳ Pending'}
                            {application.status === 'accepted' && '✓ Accepted'}
                            {application.status === 'rejected' && '✗ Rejected'}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{WORK_TYPES[job.workType]}</h3>
                        <p className="text-sm text-muted-foreground">{job.companyName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">₹{job.paymentPerDay}</p>
                        <p className="text-xs text-muted-foreground">per day</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📅</span>
                        <span>{formatDate(job.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>🕐</span>
                        <span>{job.startTime} - {job.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📍</span>
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span>📝</span>
                        <span>Applied {formatDate(application.appliedAt)}</span>
                      </div>
                    </div>

                    {application.status === 'accepted' && (
                      <div className="mt-4 p-4 bg-accent/10 rounded-lg text-accent text-sm">
                        🎉 Congratulations! You've been selected. Please contact {job.companyName} for further details.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-12 text-center border border-border">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                Start applying to jobs and track your applications here
              </p>
              <Link to="/worker-dashboard">
                <button className="btn-hero">
                  Browse Jobs
                </button>
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
