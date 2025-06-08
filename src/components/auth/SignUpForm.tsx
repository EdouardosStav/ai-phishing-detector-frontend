
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        toast({
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account.',
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-white flex items-center text-sm font-medium">
          <User className="h-4 w-4 mr-2 text-blue-400" />
          Full Name <span className="text-slate-400 ml-1">(Optional)</span>
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white flex items-center text-sm font-medium">
          <Mail className="h-4 w-4 mr-2 text-blue-400" />
          Email Address <span className="text-red-400 ml-1">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white flex items-center text-sm font-medium">
          <Lock className="h-4 w-4 mr-2 text-blue-400" />
          Password <span className="text-red-400 ml-1">*</span>
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          disabled={loading}
          required
        />
      </div>

      <Button 
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-200 hover:scale-[1.02] group"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
};

export default SignUpForm;
