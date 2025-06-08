
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast({
          title: 'Sign In Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        navigate('/dashboard');
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
        <Label htmlFor="email" className="text-white flex items-center text-sm font-medium">
          <Mail className="h-4 w-4 mr-2 text-blue-400" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white flex items-center text-sm font-medium">
          <Lock className="h-4 w-4 mr-2 text-blue-400" />
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
          disabled={loading}
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
            Signing In...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
};

export default SignInForm;
