
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReportRequest {
  url?: string;
  email?: string;
  risk_score?: number;
  risk_level?: string;
  indicators?: string[];
  explanation?: string;
}

const generateSimplePDF = (data: ReportRequest): Uint8Array => {
  // This is a very basic PDF generator - in production you'd use a proper library
  const content = `Phishing Analysis Report
  
${data.url ? 'URL' : 'Email'} Analysis
Input: ${data.url || data.email || 'N/A'}
Risk Score: ${data.risk_score || 'N/A'}/10
Risk Level: ${data.risk_level || 'N/A'}

Indicators:
${data.indicators?.join('\n') || 'None detected'}

Explanation:
${data.explanation || 'No explanation available'}

Generated on: ${new Date().toISOString()}
`;

  // Convert text to bytes (this is a simplified approach)
  return new TextEncoder().encode(content);
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
    const data: ReportRequest = await req.json();
    
    console.log('Generating report for:', data);
    
    // Generate a simple text file as PDF alternative
    const reportContent = generateSimplePDF(data);
    
    return new Response(reportContent, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="phishing-analysis-report.txt"'
      }
    });
  } catch (error) {
    console.error('Error in generate-report function:', error);
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
