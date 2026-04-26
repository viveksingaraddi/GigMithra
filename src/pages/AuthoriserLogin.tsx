import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AuthoriserLogin() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const success = await login(phone, password, 'authoriser');
    
    if (success) {
      toast.success('Welcome back!');
      navigate('/authoriser-dashboard');
    } else {
      toast.error('Invalid phone number or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
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
              Authoriser Login
            </h1>
            <p className="text-muted-foreground">
              Sign in to manage your job postings and hire workers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter your password"
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

            <Button type="submit" variant="secondary" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/authoriser-signup" className="text-primary font-medium hover:underline">
                Register your business
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Looking for work?{' '}
              <Link to="/worker-login" className="text-primary font-medium hover:underline">
                Login as Worker
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-secondary to-slate-700 items-center justify-center p-12">
        <div className="max-w-lg text-center text-secondary-foreground">
          <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <Users className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">
            Hire Workers Instantly
          </h2>
          <p className="text-secondary-foreground/80 text-lg">
            Post jobs and find verified workers for your catering business. Manage all your events from one dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
