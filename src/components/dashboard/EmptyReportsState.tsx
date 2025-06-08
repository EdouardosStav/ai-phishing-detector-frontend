
import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

const EmptyReportsState = () => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="text-center py-12">
        <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Reports Yet</h3>
        <p className="text-slate-400">
          Start analyzing URLs and emails to see your reports here.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyReportsState;
