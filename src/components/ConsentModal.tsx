import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Shield, Lock, Eye } from 'lucide-react';

interface ConsentModalProps {
  open: boolean;
  onClose: (consented: boolean) => void;
}

export function ConsentModal({ open, onClose }: ConsentModalProps) {
  const [enableMonitoring, setEnableMonitoring] = useState(false);

  const handleContinue = () => {
    if (enableMonitoring) {
      localStorage.setItem('empathai_consent', 'true');
    }
    onClose(enableMonitoring);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#4B3F72]" />
            Privacy & Consent
          </DialogTitle>
          <DialogDescription className="pt-4">
            EmpathAI respects your privacy. We want to be transparent about how we protect your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
            <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-blue-900">End-to-End Privacy</p>
              <p className="text-xs text-blue-700 mt-1">
                Your messages are processed in real-time and are never stored on our servers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50">
            <Eye className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-purple-900">Anonymized Analytics Only</p>
              <p className="text-xs text-purple-700 mt-1">
                We only store anonymized metadata (emotion type, severity level) to improve our AI models.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 pr-4">
              <Label htmlFor="monitoring" className="cursor-pointer">
                Enable Real-Time Emotional Support
              </Label>
              <p className="text-xs text-gray-500 mt-1">
                Allow EmpathAI to analyze your conversations and provide timely emotional support.
              </p>
            </div>
            <Switch
              id="monitoring"
              checked={enableMonitoring}
              onCheckedChange={setEnableMonitoring}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onClose(false)}>
            Decline
          </Button>
          <Button onClick={handleContinue} className="bg-[#4B3F72] hover:bg-[#6C4B8C]">
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
