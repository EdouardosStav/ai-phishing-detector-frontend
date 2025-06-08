
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import PhishingDetector from '@/components/PhishingDetector';
import ReportsHistory from './ReportsHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: 'You have been successfully signed out.',
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Phishing Detector</h1>
              <p className="text-sm text-slate-400">Security Analysis Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-3 py-2">
              <User className="h-4 w-4 text-blue-400" />
              <span className="text-white text-sm font-medium">
                {user?.email}
              </span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-200 group"
            >
              <LogOut className="h-4 w-4 mr-2 group-hover:animate-pulse" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 max-w-md mx-auto mb-8">
            <TabsTrigger 
              value="analyze" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Analyze
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Reports History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            <PhishingDetector />
          </TabsContent>

          <TabsContent value="history">
            <ReportsHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
