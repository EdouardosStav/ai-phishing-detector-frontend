
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisResult } from "./PhishingDetector";

interface ResultsPanelProps {
  result: AnalysisResult;
}

const ResultsPanel = ({ result }: ResultsPanelProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      case 'high':
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Shield className="h-5 w-5 text-slate-400" />;
    }
  };

  const downloadReport = async () => {
    setIsDownloading(true);
    
    try {
      console.log(`Downloading ${result.type} report from Flask backend...`);
      
      const endpoint = result.type === 'email' ? 
        'http://127.0.0.1:5000/generate-email-report' : 
        'http://127.0.0.1:5000/generate-report';
      
      const body = result.type === 'email' ? 
        { email: result.input } : 
        { url: result.input };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `phishing-analysis-report-${result.type}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Downloaded",
        description: "The analysis report has been downloaded successfully",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          {getRiskIcon(result.risk_level)}
          <span className="ml-2">Analysis Results</span>
        </CardTitle>
        <CardDescription className="text-slate-400">
          {result.type === 'url' ? 'URL' : 'Email'} security analysis completed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white font-medium">Risk Score</span>
            <div className="flex items-center space-x-2">
              <Badge variant={getRiskBadgeVariant(result.risk_level)}>
                {result.risk_level.toUpperCase()}
              </Badge>
              <span className={`text-xl font-bold ${getRiskColor(result.risk_level)}`}>
                {result.risk_score}/10
              </span>
            </div>
          </div>
          <Progress 
            value={result.risk_score * 10} 
            className="h-3"
          />
        </div>

        {/* Triggered Indicators */}
        {result.indicators && result.indicators.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-white font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
              Triggered Indicators
            </h3>
            <ul className="space-y-2">
              {result.indicators.map((indicator, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <span className="text-yellow-400 mr-2">•</span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Explanation */}
        {result.explanation && (
          <div className="space-y-3">
            <h3 className="text-white font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2 text-blue-400" />
              AI Analysis Summary
            </h3>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-300 leading-relaxed">
                {result.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Download Report */}
        <div className="pt-4 border-t border-slate-600">
          <Button
            onClick={downloadReport}
            disabled={isDownloading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Analysis Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;
