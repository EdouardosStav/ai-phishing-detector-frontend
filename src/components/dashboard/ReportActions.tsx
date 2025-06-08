
import { Button } from '@/components/ui/button';
import { MoreVertical, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ReportActionsProps {
  reportId: string;
  reportType: string;
  onDelete: (reportId: string, reportType: string) => void;
}

const ReportActions = ({ reportId, reportType, onDelete }: ReportActionsProps) => {
  const handleDeleteClick = () => {
    onDelete(reportId, reportType);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        <DropdownMenuItem
          onClick={handleDeleteClick}
          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete Report
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportActions;
