
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ClearAllReportsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  totalReports: number;
}

const ClearAllReportsDialog = ({ isOpen, onClose, onClearAll, totalReports }: ClearAllReportsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClearAll = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'All Reports Cleared',
        description: `Successfully deleted ${totalReports} report${totalReports !== 1 ? 's' : ''}.`,
      });

      onClearAll();
      onClose();
    } catch (error) {
      console.error('Error clearing all reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear all reports. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Trash className="h-5 w-5 mr-2 text-red-400" />
            Clear All Reports
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Are you sure you want to delete all {totalReports} reports? This action cannot be undone and will permanently remove all your analysis history.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleClearAll}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Clearing All...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Clear All Reports
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearAllReportsDialog;
