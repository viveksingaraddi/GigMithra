import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Plus, Users, Briefcase, CheckCircle2, XCircle, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { EVENT_TYPES, WORK_TYPES } from '@/types';

export default function AuthoriserDashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { getJobsForAuthoriser, getApplicationsForJob, updateApplicationStatus } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || user?.userType !== 'authoriser') {
      navigate('/authoriser-login');
    }
  }, [isAuthenticated, user, navigate, isAuthLoading]);

  if (isAuthLoading || !user) return null;

  const myJobs = getJobsForAuthoriser(user.id);
  
  // Get all applications for all jobs
  const allApplications = myJobs.flatMap(job => 
    getApplicationsForJob(job.id).map(app => ({ ...app, job }))
  );

  const pendingApplications = allApplications.filter(app => app.status === 'pending');
  const totalWorkers = allApplications.filter(app => app.status === 'accepted').length;

  const handleAccept = async (applicationId: string, workerName: string) => {
    await updateApplicationStatus(applicationId, 'accepted');
    toast.success(`${workerName} has been accepted!`);
  };

  const handleReject = async (applicationId: string, workerName: string) => {
    await updateApplicationStatus(applicationId, 'rejected');
    toast.info(`${workerName}'s application rejected`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-secondary to-slate-700 rounded-3xl p-8 md:p-12 text-secondary-foreground mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold">
                      {user.companyName || user.name}
                    </h1>
                    <p className="text-secondary-foreground/70 text-sm">
                      {user.location}
                    </p>
                  </div>
                </div>
              </div>
              <Link to="/post-job">
                <Button size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Post New Job
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{myJobs.length}</p>
                <p className="text-sm text-secondary-foreground/70">Jobs Posted</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{pendingApplications.length}</p>
                <p className="text-sm text-secondary-foreground/70">Pending Review</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{totalWorkers}</p>
                <p className="text-sm text-secondary-foreground/70">Workers Hired</p>
              </div>
            </div>
          </div>

          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Pending Applications ({pendingApplications.length})
              </h2>

              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <div 
                    key={app.id}
                    className="bg-card rounded-2xl p-6 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{app.workerName}</h3>
                        <p className="text-sm text-muted-foreground">
                          📞 {app.workerPhone} • 📍 {app.workerLocation}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          Applied for: {WORK_TYPES[app.job.workType]} at {EVENT_TYPES[app.job.eventType]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(app.job.date)} • {app.job.startTime} - {app.job.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        onClick={() => handleAccept(app.id, app.workerName)}
                        className="flex-1 md:flex-none gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Accept
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleReject(app.id, app.workerName)}
                        className="flex-1 md:flex-none gap-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* My Jobs */}
          <section>
            <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              My Job Postings
            </h2>

            {myJobs.length > 0 ? (
              <div className="space-y-4">
                {myJobs.map((job) => {
                  const jobApplications = getApplicationsForJob(job.id);
                  const accepted = jobApplications.filter(a => a.status === 'accepted').length;
                  const pending = jobApplications.filter(a => a.status === 'pending').length;

                  return (
                    <div 
                      key={job.id}
                      className="bg-card rounded-2xl p-6 border border-border"
                    >
                      <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              {EVENT_TYPES[job.eventType]}
                            </span>
                            <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                              {WORK_TYPES[job.workType]}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg">{job.description.slice(0, 60)}...</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            📅 {formatDate(job.date)} • 🕐 {job.startTime} - {job.endTime} • 📍 {job.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            💰 ₹{job.paymentPerDay}/day • 👥 {job.workersRequired} workers needed
                          </p>
                        </div>
                        <div className="flex gap-4 text-center">
                          <div className="px-4 py-2 bg-accent/10 rounded-lg">
                            <p className="text-xl font-bold text-accent">{accepted}</p>
                            <p className="text-xs text-muted-foreground">Accepted</p>
                          </div>
                          <div className="px-4 py-2 bg-warning/10 rounded-lg">
                            <p className="text-xl font-bold text-warning">{pending}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                          </div>
                        </div>
                      </div>

                      {/* Show accepted workers */}
                      {accepted > 0 && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <p className="text-sm font-medium mb-2">Accepted Workers:</p>
                          <div className="flex flex-wrap gap-2">
                            {jobApplications
                              .filter(a => a.status === 'accepted')
                              .map(a => (
                                <span 
                                  key={a.id}
                                  className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                                >
                                  {a.workerName} • {a.workerPhone}
                                </span>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-12 text-center border border-border">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                <p className="text-muted-foreground mb-6">
                  Post your first job and start receiving applications from workers
                </p>
                <Link to="/post-job">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Post Your First Job
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
