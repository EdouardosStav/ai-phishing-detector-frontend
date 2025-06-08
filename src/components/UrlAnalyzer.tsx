
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Globe, AlertTriangle } from "lucide-react";
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

  const isValidUrl = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const normalizeUrl = (urlString: string) => {
    // Remove any leading/trailing whitespace
    let cleanUrl = urlString.trim();
    
    // If it doesn't start with http:// or https://, add https://
    if (!cleanUrl.match(/^https?:\/\//)) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    return cleanUrl;
  };

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    const normalizedUrl = normalizeUrl(url);

    if (!isValidUrl(normalizedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL (e.g., example.com or https://example.com)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Analyzing URL:', normalizedUrl);
      
      const response = await fetch('http://127.0.0.1:5000/analyze-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      onResult({
        ...data,
        type: 'url',
        input: normalizedUrl,
      });

      toast({
        title: "Analysis Complete",
        description: "URL analysis has been completed successfully",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        toast({
          title: "Backend Connection Failed",
          description: "Cannot connect to the analysis server. Please ensure your Flask backend is running on http://127.0.0.1:5000",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Failed to analyze URL. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      analyzeUrl();
    }
  };

  const displayUrl = url || "";
  const normalizedUrl = url ? normalizeUrl(url) : "";
  const isUrlValid = !url || isValidUrl(normalizedUrl);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url" className="text-white flex items-center">
          <Globe className="h-4 w-4 mr-2 text-blue-400" />
          URL to Analyze
        </Label>
        <Input
          id="url"
          type="text"
          placeholder="example.com or https://example.com"
          value={displayUrl}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
          disabled={isLoading}
        />
        {url && !isUrlValid && (
          <div className="flex items-center text-amber-400 text-sm">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Please enter a valid URL
          </div>
        )}
        {url && isUrlValid && normalizedUrl !== url && (
          <div className="text-sm text-slate-400">
            Will analyze: {normalizedUrl}
          </div>
        )}
      </div>

      <Button 
        onClick={analyzeUrl}
        disabled={isLoading || !url.trim() || !isUrlValid}
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
