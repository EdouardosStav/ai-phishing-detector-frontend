
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
      console.log('Analyzing URL with Supabase Edge Function:', url);
      
      const response = await fetch("/api/analyze-url", {
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
      
      onResult({
        ...data,
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
