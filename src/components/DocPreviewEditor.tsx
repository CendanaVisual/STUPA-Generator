import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Share2,
  Edit3,
  Check,
  ArrowLeft,
  Sparkles,
  Save,
  RotateCcw,
  Building2,
  Calendar,
  UserCheck,
  Loader2,
  Table as TableIcon,
  Plus,
  Trash2,
} from 'lucide-react';
import { GeneratedDocument, DocSection } from '../types';
import { exportDocumentToDocx } from '../utils/docxExporter';

interface DocPreviewEditorProps {
  document: GeneratedDocument;
  onBack: () => void;
  onShare: (doc: GeneratedDocument) => void;
  onSave: (doc: GeneratedDocument) => void;
}

export const DocPreviewEditor: React.FC<DocPreviewEditorProps> = ({
  document: initialDoc,
  onBack,
  onShare,
  onSave,
}) => {
  const [doc, setDoc] = useState<GeneratedDocument>(initialDoc);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  // AI Polish section modal state
  const [polishModal, setPolishModal] = useState<{
    isOpen: boolean;
    section: DocSection | null;
    instruction: string;
    isLoading: boolean;
  }>({
    isOpen: false,
    section: null,
    instruction: '',
    isLoading: false,
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await exportDocumentToDocx(doc);
    } catch (err) {
      console.error('Word export error:', err);
      alert('Gagal mengekspor dokumen ke Word. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDoc = () => {
    onSave(doc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleUpdateSectionContent = (sectionId: string, newContent: string) => {
    setDoc((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, content: newContent } : sec
      ),
    }));
  };

  const handleRunAiPolishSection = async () => {
    if (!polishModal.section || !polishModal.instruction.trim()) return;

    setPolishModal((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch('/api/regenerate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: polishModal.section.title,
          currentContent: polishModal.section.content,
          promptInstruction: polishModal.instruction,
          docMetadata: {
            mataPelajaran: doc.mataPelajaran,
            topikMateri: doc.topikMateri,
          },
        }),
      });

      if (!response.ok) throw new Error('Gagal memproses AI Polish.');

      const data = await response.json();
      if (data.content) {
        handleUpdateSectionContent(polishModal.section.id, data.content);
      }

      setPolishModal({ isOpen: false, section: null, instruction: '', isLoading: false });
    } catch (err) {
      console.error(err);
      alert('Gagal menyempurnakan bagian ini dengan AI.');
      setPolishModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Form</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Toggle */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isEditing
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Selesai Edit' : 'Edit Dokumen'}</span>
          </button>

          {/* Save to History */}
          <button
            onClick={handleSaveDoc}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Riwayat'}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => onShare(doc)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bagikan</span>
          </button>

          {/* Print / PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cetak / PDF</span>
          </button>

          {/* Download Word */}
          <button
            onClick={handleExportWord}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Unduh File Word (.docx)</span>
          </button>
        </div>
      </div>

      {/* Main Printable Paper View */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-12 shadow-md max-w-5xl mx-auto print:shadow-none print:p-0 print:border-none print:max-w-none">
        
        {/* Document Header & Title */}
        <div className="text-center border-b-2 border-slate-900 dark:border-slate-100 pb-6 mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
            {doc.curriculum === 'kbc_kemenag' ? 'KURIKULUM BERBASIS CINTA (KBC KEMENAG)' : 'KURIKULUM MERDEKA'} — KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </p>
          <h1 className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-300 tracking-tight uppercase">
            {doc.title}
          </h1>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase">
            {doc.authorSchool}
          </p>
        </div>

        {/* Identity Table Box */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            A. Identitas Modul & Informasi Umum
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Satuan Pendidikan:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">{doc.authorSchool}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Mata Pelajaran:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">{doc.mataPelajaran}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Fase / Kelas:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">{doc.jenjangKelas}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Topik / Materi:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">{doc.topikMateri}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Penyusun / Guru:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">{doc.authorName}</strong>
            </div>
            <div>
              <span className="font-semibold text-slate-500 dark:text-slate-400">Tanggal Buat:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">
                {new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
            </div>
          </div>
        </div>

        {/* Dynamic Sections Content */}
        <div className="space-y-8">
          {doc.sections.map((section, idx) => (
            <div key={section.id || idx} className="relative group border-b border-slate-100 dark:border-slate-800 pb-6 last:border-none">
              
              {/* Section Title & AI Polish Button */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-tight flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{section.title}</span>
                </h3>

                {/* AI Polish Trigger (Hidden in Print) */}
                <button
                  onClick={() =>
                    setPolishModal({
                      isOpen: true,
                      section,
                      instruction: '',
                      isLoading: false,
                    })
                  }
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg text-[11px] font-bold no-print hover:bg-blue-100"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Sempurnakan AI</span>
                </button>
              </div>

              {/* Section Content Display / Editable */}
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    rows={6}
                    value={section.content}
                    onChange={(e) => handleUpdateSectionContent(section.id, e.target.value)}
                    className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 Gunakan format markdown (- untuk poin list, ### untuk judul kecil)
                  </p>
                </div>
              ) : (
                <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-3">
                  {section.type === 'table' && section.tableData && section.tableData.headers.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 my-3">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900 text-white font-bold text-xs">
                            {section.tableData.headers.map((h, hIdx) => (
                              <th key={hIdx} className="p-2.5 border-r border-blue-800 last:border-none">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.tableData.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={rIdx % 2 === 1 ? 'bg-slate-50 dark:bg-slate-800/40' : 'bg-white dark:bg-slate-900'}
                            >
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="p-2.5 border-t border-slate-200 dark:border-slate-800 align-top whitespace-pre-wrap">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    section.content.split('\n').map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (!trimmed) return <div key={lIdx} className="h-2"></div>;

                      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                        return (
                          <div key={lIdx} className="flex items-start space-x-2 pl-3">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>{trimmed.replace(/^[-*•]\s*/, '')}</span>
                          </div>
                        );
                      }

                      if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
                        return (
                          <h4 key={lIdx} className="font-bold text-xs text-slate-900 dark:text-slate-100 mt-3 mb-1">
                            {trimmed.replace(/^#+\s*/, '')}
                          </h4>
                        );
                      }

                      return <p key={lIdx}>{trimmed}</p>;
                    })
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Official Signature Block */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-8 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-16">
              Kepala {doc.authorSchool}
            </p>
            <p className="font-bold underline text-slate-900 dark:text-slate-100">
              {doc.kepalaSekolah || 'I Wayan Sutarja, M.Pd.'}
            </p>
            <p className="text-[11px] text-slate-500">
              NIP. {doc.nipKepala || '197803152005011008'}
            </p>
          </div>

          <div>
            <p className="text-slate-500">
              ..., {new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="font-bold text-slate-800 dark:text-slate-200 mb-16">
              Guru Mata Pelajaran
            </p>
            <p className="font-bold underline text-slate-900 dark:text-slate-100">
              {doc.authorName}
            </p>
            <p className="text-[11px] text-slate-500">
              NIP. {doc.authorNip || '198504122010012015'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Polish Modal */}
      {polishModal.isOpen && polishModal.section && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Sparkles className="w-5 h-5" />
              <span>Sempurnakan Bagian dengan AI</span>
            </div>

            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bagian: <strong className="text-slate-800 dark:text-slate-200">{polishModal.section.title}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Instruksi Penyesuaian Guru:
              </label>
              <textarea
                rows={3}
                value={polishModal.instruction}
                onChange={(e) => setPolishModal((prev) => ({ ...prev, instruction: e.target.value }))}
                placeholder="Contoh: Tambahkan ice breaking seru di kegiatan pembuka / Buat soal lebih variatif untuk siswa berkebutuhan khusus..."
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setPolishModal({ isOpen: false, section: null, instruction: '', isLoading: false })}
                className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Batal
              </button>

              <button
                onClick={handleRunAiPolishSection}
                disabled={polishModal.isLoading || !polishModal.instruction.trim()}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center space-x-2"
              >
                {polishModal.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Proses Perbaikan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
