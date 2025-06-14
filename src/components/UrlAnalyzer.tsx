
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
      
      // Process indicators to extract only meaningful values
      const meaningfulIndicators: string[] = [];
      
      if (data.indicators && typeof data.indicators === 'object') {
        Object.entries(data.indicators).forEach(([key, value]) => {
          if (value === true) {
            // Convert camelCase/snake_case to readable format
            const readableKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase();
            meaningfulIndicators.push(`Detected: ${readableKey}`);
          } else if (Array.isArray(value) && value.length > 0) {
            // Handle arrays like suspicious_keywords
            const readableKey = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').toLowerCase();
            meaningfulIndicators.push(`${readableKey}: ${value.join(', ')}`);
          }
        });
      }
      
      // Normalize risk level to lowercase to match database constraint
      const normalizedRiskLevel = data.risk_level.toLowerCase();
      
      // Create a better explanation
      let explanation = `This URL has been analyzed and shows ${normalizedRiskLevel} risk indicators with a score of ${data.score}/10.`;
      
      if (meaningfulIndicators.length > 0) {
        explanation += ` The following security concerns were identified: ${meaningfulIndicators.join(', ')}.`;
      } else {
        explanation += ` No significant security concerns were detected.`;
      }
      
      // Map Flask backend response to frontend expected format
      onResult({
        risk_score: data.score,
        risk_level: normalizedRiskLevel, // Use normalized lowercase value
        indicators: meaningfulIndicators,
        explanation: explanation,
        type: 'url',
        input: url,
      });

      toast({
        title: "Analysis Complete",
        description: "URL analysis has been completed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = "Failed to analyze URL. Please try again.";
      
      if (error instanceof Error) {
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
