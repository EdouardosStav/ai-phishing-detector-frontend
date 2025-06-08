
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "./PhishingDetector";

interface UrlAnalyzerProps {
  onResult: (result: AnalysisResult) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const UrlAnalyzer = ({ onResult, isLoading, setIsLoading }: UrlAnalyzerProps) => {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Analyzing URL with Flask backend:', url);
      
      const response = await fetch("http://127.0.0.1:5000/analyze-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Analysis response:', data);
      
      // Map Flask backend response to frontend format
      const mappedResult = {
        risk_score: data.score, // Flask returns 'score', frontend expects 'risk_score'
        risk_level: data.risk_level.toLowerCase(), // Flask returns "High", frontend expects "high"
        indicators: formatIndicators(data.indicators), // Format indicators properly
        explanation: generateExplanation(data.indicators, data.risk_level), // Generate explanation
        type: 'url' as const,
        input: url,
      };
      
      console.log('Mapped result:', mappedResult);
      onResult(mappedResult);

      toast({
        title: "Analysis Complete",
        description: "URL analysis has been completed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = "Failed to analyze URL. Please ensure the Flask backend is running on port 5000.";
      
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        errorMessage = "Cannot connect to Flask backend. Please ensure it's running at http://127.0.0.1:5000";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format indicators from Flask backend response
  const formatIndicators = (indicators: any): string[] => {
    const formattedIndicators: string[] = [];
    
    if (indicators.suspicious_keywords && indicators.suspicious_keywords.length > 0) {
      formattedIndicators.push(`Suspicious keywords: ${indicators.suspicious_keywords.join(', ')}`);
    }
    if (indicators.misleading_subdomain) {
      formattedIndicators.push('Misleading subdomain detected');
    }
    if (indicators.suspicious_tld) {
      formattedIndicators.push('Suspicious top-level domain');
    }
    if (indicators.uses_ip) {
      formattedIndicators.push('Uses IP address instead of domain');
    }
    if (indicators.has_at) {
      formattedIndicators.push('Contains @ symbol in URL');
    }
    if (indicators.many_hyphens) {
      formattedIndicators.push('Excessive hyphens in domain');
    }
    if (indicators.encoded_chars) {
      formattedIndicators.push('Contains encoded characters');
    }
    
    return formattedIndicators.length > 0 ? formattedIndicators : ['No specific indicators found'];
  };

  // Generate explanation based on indicators and risk level
  const generateExplanation = (indicators: any, riskLevel: string): string => {
    const riskCount = Object.values(indicators).filter(value => 
      value === true || (Array.isArray(value) && value.length > 0)
    ).length;
    
    if (riskLevel.toLowerCase() === 'high') {
      return `This URL shows ${riskCount} phishing indicators including suspicious patterns that are commonly used in phishing attacks. Exercise extreme caution.`;
    } else if (riskLevel.toLowerCase() === 'medium') {
      return `This URL shows ${riskCount} potential phishing indicators. While not definitively malicious, caution is advised.`;
    } else {
      return `This URL shows minimal phishing indicators and appears to be relatively safe, though general web safety practices should still be followed.`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-white flex items-center">
          <Globe className="h-4 w-4 mr-2 text-blue-400" />
          URL to Analyze
        </Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
          disabled={isLoading}
        />
        <div className="text-sm text-slate-400">
          Enter the complete URL including http:// or https://
        </div>
      </div>

      <Button 
        onClick={analyzeUrl}
        disabled={isLoading || !url.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing URL...
          </>
        ) : (
          <>
            <Globe className="mr-2 h-4 w-4" />
            Analyze URL
          </>
        )}
      </Button>
    </div>
  );
};

export default UrlAnalyzer;
