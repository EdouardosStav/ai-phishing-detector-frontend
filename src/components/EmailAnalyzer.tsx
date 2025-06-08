
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnalysisResult } from "./PhishingDetector";

interface EmailAnalyzerProps {
  onResult: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const EmailAnalyzer = ({ onResult, isLoading, setIsLoading }: EmailAnalyzerProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const analyzeEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Content Required",
        description: "Please enter email content to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Analyzing email content...');
      
      const { data, error } = await supabase.functions.invoke('analyze-email', {
        body: { email }
      });

      if (error) {
        throw new Error(`Analysis failed: ${error.message}`);
      }
      
      onResult({
        ...data,
        type: 'email',
        input: email,
      });

      toast({
        title: "Analysis Complete",
        description: "Email analysis has been completed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white flex items-center">
          <Mail className="h-4 w-4 mr-2 text-blue-400" />
          Email Content to Analyze
        </Label>
        <Textarea
          id="email"
          placeholder="Paste the email content here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 min-h-[120px]"
          disabled={isLoading}
        />
        <div className="text-sm text-slate-400">
          {email.length}/5000 characters
        </div>
      </div>

      <Button 
        onClick={analyzeEmail}
        disabled={isLoading || !email.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing Email...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Analyze Email
          </>
        )}
      </Button>
    </div>
  );
};

export default EmailAnalyzer;
