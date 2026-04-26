import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Plus, Calendar, Clock, MapPin, Users, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
  { value: 'party', label: 'Birthday Party' },
  { value: 'temple_function', label: 'Temple Function' },
  { value: 'corporate', label: 'Corporate Event' },
  { value: 'other', label: 'Other Event' },
];

const WORK_TYPES = [
  { value: 'serving', label: 'Serving Food' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'table_setup', label: 'Table Setup' },
  { value: 'water_service', label: 'Water Service' },
  { value: 'cooking_assist', label: 'Cooking Assistant' },
  { value: 'other', label: 'Other Work' },
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function PostJob() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { addJob } = useData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    eventType: '',
    workType: '',
    workersRequired: '',
    paymentPerDay: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated || user?.userType !== 'authoriser') {
      navigate('/authoriser-login');
    }
  }, [isAuthenticated, user, navigate, isAuthLoading]);

  if (isAuthLoading || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    await addJob({
      authoriserId: user.id,
      authoriserName: user.name,
      companyName: user.companyName || user.name,
      eventType: formData.eventType as any,
      workType: formData.workType as any,
      workersRequired: parseInt(formData.workersRequired),
      paymentPerDay: parseInt(formData.paymentPerDay),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.location,
      description: formData.description,
    });

    toast.success('Job posted successfully!');
    navigate('/authoriser-dashboard');
    setIsLoading(false);
  };

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link 
            to="/authoriser-dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">Post a New Job</h1>
                <p className="text-muted-foreground">Fill in the details to find workers</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event & Work Type */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select event type</option>
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Work Type
                  </label>
                  <select
                    name="workType"
                    value={formData.workType}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select work type</option>
                    {WORK_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Workers & Payment */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Workers Required
                  </label>
                  <input
                    type="number"
                    name="workersRequired"
                    value={formData.workersRequired}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 5"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <IndianRupee className="w-4 h-4 inline mr-1" />
                    Payment Per Day (₹)
                  </label>
                  <input
                    type="number"
                    name="paymentPerDay"
                    value={formData.paymentPerDay}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., 800"
                    min="100"
                    required
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="input-field"
                    min={minDate}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Event Location
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field min-h-[120px] resize-none"
                  placeholder="Describe the job requirements, dress code, meals provided, etc."
                  required
                />
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Post Job
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
