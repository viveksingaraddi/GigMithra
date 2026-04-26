import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

export default function AuthoriserSignup() {
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = await signup({
      name: formData.name,
      companyName: formData.companyName,
      phone: formData.phone,
      password: formData.password,
      location: formData.location,
      userType: 'authoriser',
    });

    if (success) {
      toast.success('Business registered successfully!');
      navigate('/authoriser-dashboard');
    } else {
      toast.error('Phone number already registered');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary to-slate-700 items-center justify-center p-12">
        <div className="max-w-lg text-center text-secondary-foreground">
          <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Users className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Grow Your Catering Business
          </h2>
          <p className="text-secondary-foreground/80 text-lg">
            Register your business and get access to thousands of skilled workers ready to work at your events.
          </p>
          <div className="mt-8 flex justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">5000+</p>
              <p className="text-secondary-foreground/70 text-sm">Active workers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">24hrs</p>
              <p className="text-secondary-foreground/70 text-sm">Avg hire time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">
              Gig<span className="text-primary">Mithra</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Register Your Business
            </h1>
            <p className="text-muted-foreground">
              Start hiring workers for your events
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Company / Business Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your business name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                City
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select your city</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button type="submit" variant="secondary" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Register Business <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already registered?{' '}
              <Link to="/authoriser-login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Looking for work?{' '}
              <Link to="/worker-signup" className="text-primary font-medium hover:underline">
                Register as Worker
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
