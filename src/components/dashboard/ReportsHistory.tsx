import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { History, Download, Globe, Mail, Calendar, AlertTriangle, CheckCircle, XCircle, Trash, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DeleteReportDialog from '../DeleteReportDialog';
import ClearAllReportsDialog from '../ClearAllReportsDialog';

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

const ReportsHistory = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reports history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (reportId: string, reportType: string) => {
    setSelectedReportId(reportId);
    setSelectedReportType(reportType);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    fetchReports();
  };

  const handleClearAllSuccess = () => {
    setReports([]);
  };

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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <History className="h-8 w-8 mr-3 text-blue-400" />
            Reports History
          </h2>
        </div>
        <p className="text-slate-300">
          View all your previous phishing analysis reports
        </p>
        {reports.length > 0 && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => setClearAllDialogOpen(true)}
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              <Trash className="h-4 w-4 mr-2" />
              Clear All Reports ({reports.length})
            </Button>
          </div>
        )}
      </div>

      {reports.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="text-center py-12">
            <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
            <p className="text-slate-400">
              Start analyzing URLs and emails to see your reports here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="bg-slate-800/50 border-slate-700">
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(report.id, report.type)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          ))}
        </div>
      )}
      <DeleteReportDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        reportId={selectedReportId}
        reportType={selectedReportType}
        onDelete={handleDeleteSuccess}
      />
      <ClearAllReportsDialog
        isOpen={clearAllDialogOpen}
        onClose={() => setClearAllDialogOpen(false)}
        onClearAll={handleClearAllSuccess}
        totalReports={reports.length}
      />
    </div>
  );
};

export default ReportsHistory;
