
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Mail, Calendar, AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';
import ReportActions from './ReportActions';

interface Report {
  id: string;
  type: string;
  input_text: string;
  risk_score: number;
  risk_level: string;
  explanation: string | null;
  indicators: string[] | null;
  pdf_url: string | null;
  created_at: string;
  user_id: string;
}

interface ReportCardProps {
  report: Report;
  onDelete: (reportId: string, reportType: string) => void;
}

const ReportCard = ({ report, onDelete }: ReportCardProps) => {
  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'high':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-400" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {report.type === 'url' ? (
              <Globe className="h-5 w-5 text-blue-400" />
            ) : (
              <Mail className="h-5 w-5 text-blue-400" />
            )}
            <CardTitle className="text-white">
              {report.type.toUpperCase()} Analysis
            </CardTitle>
            <Badge variant={getRiskBadgeVariant(report.risk_level)}>
              {report.risk_level.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-slate-400 text-sm">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(report.created_at)}
            </div>
            <ReportActions
              reportId={report.id}
              reportType={report.type}
              onDelete={onDelete}
            />
          </div>
        </div>
        <CardDescription className="text-slate-400">
          Risk Score: {report.risk_score}/10
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-white font-medium mb-2">Analyzed Content:</h4>
          <div className="bg-slate-700/50 rounded p-3 text-slate-300 text-sm">
            {truncateText(report.input_text, 200)}
          </div>
        </div>

        {report.explanation && (
          <div>
            <h4 className="text-white font-medium mb-2 flex items-center">
              {getRiskIcon(report.risk_level)}
              <span className="ml-2">Analysis Summary:</span>
            </h4>
            <div className="bg-slate-700/50 rounded p-3 text-slate-300 text-sm">
              {truncateText(report.explanation, 300)}
            </div>
          </div>
        )}

        {report.indicators && report.indicators.length > 0 && (
          <div>
            <h4 className="text-white font-medium mb-2">Triggered Indicators:</h4>
            <div className="flex flex-wrap gap-2">
              {report.indicators.slice(0, 3).map((indicator, index) => (
                <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-400">
                  {truncateText(indicator, 50)}
                </Badge>
              ))}
              {report.indicators.length > 3 && (
                <Badge variant="outline" className="text-slate-400 border-slate-400">
                  +{report.indicators.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {report.pdf_url && (
          <div className="pt-2">
            <Button
              onClick={() => window.open(report.pdf_url!, '_blank')}
              variant="outline"
              size="sm"
              className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportCard;
