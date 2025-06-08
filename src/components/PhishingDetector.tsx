
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Globe, Mail } from "lucide-react";
import UrlAnalyzer from "./UrlAnalyzer";
import EmailAnalyzer from "./EmailAnalyzer";
import ResultsPanel from "./ResultsPanel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface AnalysisResult {
  risk_score: number;
  risk_level: string;
  indicators: string[];
  explanation: string;
  type: 'url' | 'email';
  input: string;
}

const PhishingDetector = () => {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleResult = async (analysisResult: AnalysisResult) => {
    setResult(analysisResult);
    
    // Save report to database
    if (user) {
      try {
        const { error } = await supabase.from('reports').insert({
          user_id: user.id,
          type: analysisResult.type,
          input_text: analysisResult.input,
          risk_score: analysisResult.risk_score,
          risk_level: analysisResult.risk_level,
          explanation: analysisResult.explanation,
          indicators: analysisResult.indicators,
        });

        if (error) {
          console.error('Error saving report:', error);
          toast({
            title: 'Warning',
            description: 'Analysis completed but failed to save to history',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error saving report:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-full mr-3">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white">
            AI Phishing Detector
          </h1>
        </div>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Analyze URLs and emails for phishing threats using advanced AI detection algorithms
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Analysis Tabs */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Security Analysis
            </CardTitle>
            <CardDescription className="text-slate-400">
              Choose what you'd like to analyze for potential phishing threats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                <TabsTrigger 
                  value="url" 
                  className="flex items-center data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  URL Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="email"
                  className="flex items-center data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="mt-6">
                <UrlAnalyzer 
                  onResult={handleResult} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>

              <TabsContent value="email" className="mt-6">
                <EmailAnalyzer 
                  onResult={handleResult} 
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Panel */}
        {result && (
          <div className="animate-fade-in">
            <ResultsPanel result={result} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingDetector;
