import { useState, useRef, useEffect } from 'react';
import { FolderUp, Download, FileDown, RotateCcw, Upload, ChevronDown, AlertCircle, CheckCircle2, AlertTriangle, X, FileJson } from 'lucide-react';
import { useCustomerDataStore } from '@/store/useCustomerDataStore';
import { validateCustomerJSON } from '@/utils/jsonValidator';
import { cn } from '@/lib/utils';
import type { CustomerConfig } from '@/data/defaultDemoData';

export function ConfigMenu() {
  const [open, setOpen] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data, isCustomerLoaded, loadCustomerData, resetToDemo, getTemplate, exportCurrent } = useCustomerDataStore();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleDownloadCurrent = () => {
    const json = JSON.stringify(exportCurrent(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.meta.customerName.toLowerCase().replace(/\s+/g, '-')}-capacity.json`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handleDownloadTemplate = () => {
    const json = JSON.stringify(getTemplate(), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contoso-capacity-template.json';
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const handleReset = () => {
    resetToDemo();
    setOpen(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
            isCustomerLoaded
              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30'
              : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
          )}
          title="Customer Config"
        >
          <FileJson className="w-4 h-4" />
          <span className="hidden md:block text-xs">
            {isCustomerLoaded ? data.meta.customerName : 'Config'}
          </span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1 w-64 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-lg z-50 py-1 overflow-hidden">
            {/* Current state indicator */}
            <div className="px-3 py-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
              <p className="text-xs font-medium text-[hsl(var(--foreground))]">
                {isCustomerLoaded ? `📋 ${data.meta.customerName}` : '🧪 Demo Data'}
              </p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]">
                {data.quotas.length} quotas · {data.deployments.length} deployments
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={() => { setShowUploadDialog(true); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <Upload className="w-4 h-4 text-[hsl(var(--primary))]" />
              <div className="text-left">
                <p className="font-medium text-xs">Upload Customer JSON</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Load a customer's AI setup</p>
              </div>
            </button>

            <button
              onClick={handleDownloadCurrent}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <p className="font-medium text-xs">Download Current</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Export as JSON file</p>
              </div>
            </button>

            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
            >
              <FileDown className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <p className="font-medium text-xs">Download Template</p>
                <p className="text-[10px] text-[hsl(var(--muted-foreground))]">Contoso sample — fill in for your customer</p>
              </div>
            </button>

            <div className="border-t border-[hsl(var(--border))]" />

            <button
              onClick={handleReset}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <p className="font-medium text-xs">Reset to Demo Data</p>
            </button>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      {showUploadDialog && (
        <UploadDialog onClose={() => setShowUploadDialog(false)} onLoad={loadCustomerData} />
      )}
    </>
  );
}

function UploadDialog({ onClose, onLoad }: { onClose: () => void; onLoad: (config: CustomerConfig) => void }) {
  const [dragOver, setDragOver] = useState(false);
  const [validationResult, setValidationResult] = useState<ReturnType<typeof validateCustomerJSON> | null>(null);
  const [pendingData, setPendingData] = useState<CustomerConfig | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const result = validateCustomerJSON(parsed);
        setValidationResult(result);
        if (result.valid) {
          setPendingData(parsed as CustomerConfig);
        }
      } catch {
        setValidationResult({
          valid: false,
          errors: ['Invalid JSON — could not parse the file. Please check for syntax errors.'],
          warnings: [],
          summary: null,
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.json')) processFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirm = () => {
    if (pendingData) {
      onLoad(pendingData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <div>
            <h3 className="font-semibold text-[hsl(var(--foreground))]">Upload Customer JSON</h3>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Load a customer's AI capacity configuration</p>
          </div>
          <button onClick={onClose} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              dragOver
                ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.05)]'
                : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)] hover:bg-[hsl(var(--muted)/0.3)]'
            )}
          >
            <FolderUp className="w-10 h-10 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">
              Drop a JSON file here or click to browse
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Accepts .json files following the customer config schema
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-3">
              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-semibold mb-2">
                    <AlertCircle className="w-4 h-4" /> {validationResult.errors.length} Error(s)
                  </div>
                  {validationResult.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-600 dark:text-red-400 ml-6">• {err}</p>
                  ))}
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400 text-xs font-semibold mb-2">
                    <AlertTriangle className="w-4 h-4" /> {validationResult.warnings.length} Warning(s)
                  </div>
                  {validationResult.warnings.map((w, i) => (
                    <p key={i} className="text-xs text-yellow-600 dark:text-yellow-400 ml-6">• {w}</p>
                  ))}
                </div>
              )}

              {/* Success Summary */}
              {validationResult.valid && validationResult.summary && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-xs font-semibold mb-2">
                    <CheckCircle2 className="w-4 h-4" /> Valid Configuration
                  </div>
                  <div className="ml-6 grid grid-cols-2 gap-1 text-xs text-[hsl(var(--foreground))]">
                    <span>Customer:</span><span className="font-semibold">{validationResult.summary.customerName}</span>
                    <span>Quotas:</span><span>{validationResult.summary.quotaCount}</span>
                    <span>Deployments:</span><span>{validationResult.summary.deploymentCount}</span>
                    <span>Trend Points:</span><span>{validationResult.summary.trendCount || 'None (will use placeholder)'}</span>
                    <span>Regions:</span><span>{validationResult.summary.regionCount || 'Auto-derived from quotas'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-[hsl(var(--border))]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!validationResult?.valid}
            className="px-4 py-2 text-sm font-medium bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Load Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
