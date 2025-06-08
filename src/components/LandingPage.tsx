
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Lock, Eye, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStartAnalysis = () => {
    if (user) {
      // If authenticated, go directly to dashboard
      navigate('/dashboard');
    } else {
      // If not authenticated, redirect to auth page with message
      navigate('/auth?redirect=true');
    }
  };

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI-Powered Detection",
      description: "Advanced machine learning algorithms analyze threats in real-time"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Secure Analysis",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Detailed Reports",
      description: "Get comprehensive insights with risk scores and explanations"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI Phishing Detector</span>
          </div>
          
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-300 text-sm hidden sm:inline">Welcome, {user.email}</span>
                <Button
                  onClick={() => navigate('/dashboard')}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 font-medium px-4 py-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleStartAnalysis}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Protect Yourself from
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 block">
                Phishing Threats
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Advanced AI-powered analysis to detect malicious URLs and suspicious emails. 
              Get instant risk assessments and detailed security reports.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button
              onClick={handleStartAnalysis}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 group border-0"
            >
              <Shield className="h-6 w-6 mr-3 group-hover:animate-pulse" />
              Start Security Analysis
              <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            {!user && (
              <div className="text-center sm:text-left">
                <p className="text-sm text-slate-400 mb-1">
                  Free analysis • No credit card required
                </p>
                <p className="text-xs text-slate-500">
                  Join 10,000+ users protecting themselves online
                </p>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-8 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-6">Why Choose Our Platform?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              {[
                "Real-time AI Analysis",
                "Enterprise Security",
                "Detailed Risk Reports",
                "Easy to Use Interface"
              ].map((item, index) => (
                <div key={index} className="flex items-center text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
