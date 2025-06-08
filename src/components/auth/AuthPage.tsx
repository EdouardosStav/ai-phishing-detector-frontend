
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isRedirect = searchParams.get('redirect') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full mr-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              AI Phishing Detector
            </h1>
          </div>
          {isRedirect ? (
            <div className="bg-blue-900/50 border border-blue-700 rounded-lg p-4 mb-4">
              <p className="text-blue-200 text-sm">
                🔒 Please sign in to begin your phishing analysis
              </p>
            </div>
          ) : (
            <p className="text-slate-300">
              Sign in to access your phishing analysis dashboard
            </p>
          )}
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome</CardTitle>
            <CardDescription className="text-slate-400 text-center">
              {activeTab === 'signin' 
                ? 'Sign in to your account to continue' 
                : 'Create a new account to get started'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-6">
                <SignInForm />
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
