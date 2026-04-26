import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Briefcase, MapPin, FileText, User } from 'lucide-react';
import JobCard from '@/components/JobCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function WorkerDashboard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { jobs, getApplicationsForWorker } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || user?.userType !== 'worker') {
      navigate('/worker-login');
    }
  }, [isAuthenticated, user, navigate, isAuthLoading]);

  if (isAuthLoading || !user) return null;

  const userApplications = getApplicationsForWorker(user.id);
  const appliedJobIds = userApplications.map(app => app.jobId);
  
  // Filter jobs by user location and exclude already applied jobs
  const availableJobs = jobs.filter(
    job => job.location === user.location && !appliedJobIds.includes(job.id)
  );
  
  // Also show jobs from other locations
  const otherJobs = jobs.filter(
    job => job.location !== user.location && !appliedJobIds.includes(job.id)
  );

  const pendingApplications = userApplications.filter(app => app.status === 'pending').length;
  const acceptedApplications = userApplications.filter(app => app.status === 'accepted').length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-orange-medium rounded-3xl p-8 md:p-12 text-primary-foreground mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                  Welcome back, {user.name}! 👋
                </h1>
                <p className="text-primary-foreground/80 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </p>
              </div>
              <Link 
                to="/my-applications"
                className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                My Applications
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{userApplications.length}</p>
                <p className="text-sm text-primary-foreground/70">Total Applied</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{pendingApplications}</p>
                <p className="text-sm text-primary-foreground/70">Pending</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold">{acceptedApplications}</p>
                <p className="text-sm text-primary-foreground/70">Accepted</p>
              </div>
            </div>
          </div>

          {/* Jobs in User's Location */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold">
                Jobs in {user.location}
              </h2>
              <span className="text-sm text-muted-foreground">
                {availableJobs.length} jobs available
              </span>
            </div>

            {availableJobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-12 text-center border border-border">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No jobs in your area</h3>
                <p className="text-muted-foreground">
                  Check back later or explore jobs in other cities below
                </p>
              </div>
            )}
          </section>

          {/* Other Jobs */}
          {otherJobs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold">
                  Jobs in Other Cities
                </h2>
                <span className="text-sm text-muted-foreground">
                  {otherJobs.length} jobs available
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherJobs.slice(0, 6).map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
