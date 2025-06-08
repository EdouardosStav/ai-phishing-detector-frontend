
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailAnalysisRequest {
  email: string;
}

interface AnalysisResult {
  risk_score: number;
  risk_level: string;
  indicators: string[];
  explanation: string;
}

const analyzeEmail = (email: string): AnalysisResult => {
  const indicators: string[] = [];
  let riskScore = 0;

  // Check for urgent language
  const urgentWords = ['urgent', 'immediate', 'expires today', 'act now', 'limited time', 'verify now'];
  const urgentMatches = urgentWords.filter(word => email.toLowerCase().includes(word.toLowerCase()));
  if (urgentMatches.length > 0) {
    indicators.push(`Urgent language detected: ${urgentMatches.join(', ')}`);
    riskScore += urgentMatches.length;
  }

  // Check for suspicious links
  const urlPattern = /https?:\/\/[^\s]+/g;
  const urls = email.match(urlPattern) || [];
  const suspiciousUrls = urls.filter(url => {
    return url.includes('bit.ly') || url.includes('tinyurl') || /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/.test(url);
  });
  if (suspiciousUrls.length > 0) {
    indicators.push(`Suspicious links detected: ${suspiciousUrls.length} potentially harmful URLs`);
    riskScore += suspiciousUrls.length * 2;
  }

  // Check for personal information requests
  const personalInfoKeywords = ['social security', 'ssn', 'password', 'pin', 'credit card', 'bank account'];
  const personalInfoMatches = personalInfoKeywords.filter(keyword => 
    email.toLowerCase().includes(keyword.toLowerCase())
  );
  if (personalInfoMatches.length > 0) {
    indicators.push(`Requests for personal information: ${personalInfoMatches.join(', ')}`);
    riskScore += personalInfoMatches.length * 2;
  }

  // Check for impersonation indicators
  const impersonationKeywords = ['verify your account', 'suspended', 'locked', 'unauthorized access', 'click here to confirm'];
  const impersonationMatches = impersonationKeywords.filter(keyword => 
    email.toLowerCase().includes(keyword.toLowerCase())
  );
  if (impersonationMatches.length > 0) {
    indicators.push(`Potential impersonation tactics: ${impersonationMatches.join(', ')}`);
    riskScore += impersonationMatches.length;
  }

  // Check for poor grammar/spelling (simple check)
  const grammarIssues = ['recieve', 'seperate', 'occured', 'loose', 'there account'];
  const grammarMatches = grammarIssues.filter(issue => 
    email.toLowerCase().includes(issue.toLowerCase())
  );
  if (grammarMatches.length > 0) {
    indicators.push('Poor grammar or spelling detected');
    riskScore += 1;
  }

  // Check for monetary references
  const moneyKeywords = ['$', 'money', 'payment', 'refund', 'prize', 'lottery', 'inheritance'];
  const moneyMatches = moneyKeywords.filter(keyword => 
    email.toLowerCase().includes(keyword.toLowerCase())
  );
  if (moneyMatches.length > 0) {
    indicators.push(`Financial references detected: ${moneyMatches.join(', ')}`);
    riskScore += moneyMatches.length;
  }

  // Determine risk level
  let riskLevel: string;
  if (riskScore <= 2) {
    riskLevel = 'low';
  } else if (riskScore <= 6) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  // Generate explanation
  const explanation = indicators.length > 0 
    ? `This email shows ${riskLevel} risk indicators. The analysis detected ${indicators.length} potential phishing signals including ${indicators.slice(0, 2).join(' and ')}${indicators.length > 2 ? ' among others' : ''}. ${riskLevel === 'high' ? 'This email is likely a phishing attempt - do not click any links or provide personal information.' : riskLevel === 'medium' ? 'This email shows concerning patterns - verify the sender before taking any action.' : 'This email shows some minor concerns but appears relatively safe.'}`
    : 'This email appears to be safe with no obvious phishing indicators detected.';

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
    const { email }: EmailAnalysisRequest = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email content is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Analyzing email content...');
    
    const result = analyzeEmail(email);
    
    console.log('Analysis result:', result);

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in analyze-email function:', error);
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
