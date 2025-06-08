
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { History, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import DeleteReportDialog from '../DeleteReportDialog';
import ClearAllReportsDialog from '../ClearAllReportsDialog';
import ReportCard from './ReportCard';
import EmptyReportsState from './EmptyReportsState';

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
        <EmptyReportsState />
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onDelete={handleDeleteClick}
            />
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
