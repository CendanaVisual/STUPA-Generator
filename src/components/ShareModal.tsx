import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe, ExternalLink } from 'lucide-react';
import { GeneratedDocument } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: GeneratedDocument | null;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  document,
  shareUrl,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !document) return null;

  const fullUrl = window.location.origin + (shareUrl || `?shareId=${document.id}`);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center mx-auto mb-2">
            <Share2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Bagikan Dokumen Pembelajaran
          </h3>
          <p className="text-xs text-slate-500">
            {document.title}
          </p>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="block text-[11px] font-bold text-slate-500">
            Tautan Akses Publik:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={fullUrl}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex-shrink-0 flex items-center space-x-1"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
