
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UrlAnalysisRequest {
  url: string;
}

interface AnalysisResult {
  risk_score: number;
  risk_level: string;
  indicators: string[];
  explanation: string;
}

const analyzeUrl = (url: string): AnalysisResult => {
  const indicators: string[] = [];
  let riskScore = 0;

  // Check for suspicious TLDs
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.pw', '.top'];
  if (suspiciousTlds.some(tld => url.includes(tld))) {
    indicators.push('Suspicious top-level domain detected');
    riskScore += 2;
  }

  // Check for URL shorteners
  const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl', 'ow.ly'];
  if (shorteners.some(shortener => url.includes(shortener))) {
    indicators.push('URL shortener detected');
    riskScore += 1;
  }

  // Check for suspicious keywords
  const suspiciousKeywords = ['login', 'verify', 'secure', 'update', 'confirm', 'urgent'];
  const keywordMatches = suspiciousKeywords.filter(keyword => url.toLowerCase().includes(keyword));
  if (keywordMatches.length > 0) {
    indicators.push(`Suspicious keywords detected: ${keywordMatches.join(', ')}`);
    riskScore += keywordMatches.length;
  }

  // Check for IP addresses instead of domain names
  const ipPattern = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/;
  if (ipPattern.test(url)) {
    indicators.push('IP address used instead of domain name');
    riskScore += 3;
  }

  // Check for excessive subdomains
  try {
    const urlObj = new URL(url);
    const subdomains = urlObj.hostname.split('.').length - 2;
    if (subdomains > 2) {
      indicators.push('Excessive number of subdomains');
      riskScore += 2;
    }
  } catch (e) {
    indicators.push('Invalid URL format');
    riskScore += 1;
  }

  // Check for HTTPS
  if (!url.startsWith('https://')) {
    indicators.push('URL does not use HTTPS');
    riskScore += 1;
  }

  // Determine risk level
  let riskLevel: string;
  if (riskScore <= 2) {
    riskLevel = 'low';
  } else if (riskScore <= 5) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  // Generate explanation
  const explanation = indicators.length > 0 
    ? `This URL shows ${riskLevel} risk indicators. The analysis detected ${indicators.length} potential phishing signals including ${indicators.slice(0, 2).join(' and ')}${indicators.length > 2 ? ' among others' : ''}. ${riskLevel === 'high' ? 'Exercise extreme caution before visiting this link.' : riskLevel === 'medium' ? 'Proceed with caution and verify the source.' : 'This appears to be a relatively safe URL, but always verify the sender.'}`
    : 'This URL appears to be safe with no obvious phishing indicators detected.';

  return {
    risk_score: Math.min(riskScore, 10),
    risk_level: riskLevel,
    indicators,
    explanation
  };
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { url }: UrlAnalysisRequest = await req.json();
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Analyzing URL:', url);
    
    const result = analyzeUrl(url);
    
    console.log('Analysis result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in analyze-url function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);
