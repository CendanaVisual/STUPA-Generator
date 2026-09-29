import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DocTypeSelector } from './components/DocTypeSelector';
import { DocGeneratorForm } from './components/DocGeneratorForm';
import { DocPreviewEditor } from './components/DocPreviewEditor';
import { TemplatesView } from './components/TemplatesView';
import { HistoryDashboard } from './components/HistoryDashboard';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { ShareModal } from './components/ShareModal';
import { generateDocumentWithAI } from './utils/geminiClient';
import {
  DocType,
  DocFormData,
  GeneratedDocument,
  TeacherProfile,
  DocumentTemplate,
} from './types';
import { AlertCircle, Sparkles, GraduationCap, ShieldCheck, Heart } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('STUPA Generator Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="max-w-md text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Terjadi Kesalahan Sistem
            </h1>
            <p className="text-sm text-slate-600">
              {this.state.error?.message || 'Silakan muat ulang halaman.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('stupa_theme') === 'dark';
  });

  const [currentUser, setCurrentUser] = useState<TeacherProfile | null>(() => {
    const saved = localStorage.getItem('stupa_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged in teacher
    return {
      id: 'usr_pedungan_official',
      email: 'sdn7pedungan63@gmail.com',
      name: 'Ni Made Sri Wahyuni, S.Pd.',
      nip: '198504122010012015',
      sekolah: 'SD Negeri 07 Pedungan',
      mataPelajaranUtama: 'Ilmu Pengetahuan Alam (IPA)',
      joinedAt: new Date().toISOString(),
      plan: 'premium',
      quotaLeft: 999,
    };
  });

  const [history, setHistory] = useState<GeneratedDocument[]>(() => {
    const saved = localStorage.getItem('stupa_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [selectedDocType, setSelectedDocType] = useState<DocType>('modul_ajar');
  const [currentDoc, setCurrentDoc] = useState<GeneratedDocument | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'templates' | 'history' | 'pricing'>('create');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formInitialData, setFormInitialData] = useState<Partial<DocFormData> | undefined>(undefined);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [shareData, setShareData] = useState<{
    isOpen: boolean;
    doc: GeneratedDocument | null;
    shareUrl: string;
  }>({
    isOpen: false,
    doc: null,
    shareUrl: '',
  });

  // Dark mode sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('stupa_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('stupa_theme', 'light');
    }
  }, [darkMode]);

  // Save history to LocalStorage
  useEffect(() => {
    localStorage.setItem('stupa_history', JSON.stringify(history));
  }, [history]);

  // Save user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stupa_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stupa_user');
    }
  }, [currentUser]);

  const handleGenerateDoc = async (formData: DocFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        authorName: currentUser?.name || 'Ni Made Sri Wahyuni, S.Pd.',
        authorSchool: currentUser?.sekolah || 'SD Negeri 07 Pedungan',
        authorNip: currentUser?.nip || '198504122010012015',
      };

      // Use client-side Gemini API directly instead of server fetch
      const generatedDoc = await generateDocumentWithAI(payload);
      setCurrentDoc(generatedDoc);

      // Save to history
      setHistory((prev) => [generatedDoc, ...prev.filter((i) => i.id !== generatedDoc.id)]);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Terjadi kesalahan saat menggenerasi dokumen dengan Gemini.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedDocType(template.docType);
    if (template.formData) {
      setFormInitialData(template.formData);
    }
    setCurrentDoc(null);
    setActiveTab('create');
  };

  const handleShareDoc = async (docToShare: GeneratedDocument) => {
    // Client-side share using document ID (no server needed)
    setShareData({
      isOpen: true,
      doc: docToShare,
      shareUrl: `?shareId=${docToShare.id}`,
    });
  };

  const handleDeleteDoc = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini dari riwayat?')) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (currentDoc?.id === id) {
        setCurrentDoc(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors flex flex-col">
      {/* Header Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'pricing') {
            setIsPricingOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => setCurrentUser(null)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Global Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-start space-x-3 text-rose-800 dark:text-rose-200 text-xs no-print">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Pemberitahuan Sistem:</span> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-500 hover:text-rose-700 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Create Document View */}
        {activeTab === 'create' && (
          <div className="space-y-8">
            {currentDoc ? (
              <DocPreviewEditor
                document={currentDoc}
                onBack={() => setCurrentDoc(null)}
                onShare={handleShareDoc}
                onSave={(updatedDoc) => {
                  setHistory((prev) => [
                    updatedDoc,
                    ...prev.filter((i) => i.id !== updatedDoc.id),
                  ]);
                }}
              />
            ) : (
              <>
                {/* Hero Greeting Card */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                  <div className="relative z-10 max-w-3xl space-y-3">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-blue-200 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Standar Kurikulum Merdeka & KBC Kemenag Kemendikbudristek</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                      Generasi Administrasi Pembelajaran Guru Otomatis Berbasis AI
                    </h1>

                    <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
                      Buat Modul Ajar, LKPD, Soal HOTS, Rubrik Penilaian, ATP, Modul Kokulikuler, hingga Jurnal Refleksi Harian dalam hitungan detik. Siap diunduh sebagai dokumen Word (.docx) resmi.
                    </p>
                  </div>
                </div>

                {/* Step 1: Doc Type Selector */}
                <DocTypeSelector
                  selectedDocType={selectedDocType}
                  onSelectDocType={(type) => {
                    setSelectedDocType(type);
                    setFormInitialData(undefined);
                  }}
                />

                {/* Step 2: Generator Form */}
                <DocGeneratorForm
                  selectedDocType={selectedDocType}
                  onSubmit={handleGenerateDoc}
                  isLoading={isLoading}
                  currentUser={currentUser}
                  initialFormData={formInitialData}
                />
              </>
            )}
          </div>
        )}

        {/* Tab 2: Templates View */}
        {activeTab === 'templates' && (
          <TemplatesView onSelectTemplate={handleSelectTemplate} />
        )}

        {/* Tab 3: History & Analytics */}
        {activeTab === 'history' && (
          <HistoryDashboard
            history={history}
            currentUser={currentUser}
            onViewDoc={(doc) => {
              setCurrentDoc(doc);
              setActiveTab('create');
            }}
            onDeleteDoc={handleDeleteDoc}
            onShareDoc={handleShareDoc}
            onCreateNew={() => {
              setCurrentDoc(null);
              setActiveTab('create');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              STUPA GENERATOR
            </span>
            <span>• Platform Administrasi Guru Indonesia</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Didedikasikan untuk Seluruh Guru & Pengajar Inspiratif Indonesia
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSignInSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <SubscriptionModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        currentUser={currentUser}
        onUpgradeToPremium={() => {
          if (currentUser) {
            setCurrentUser({ ...currentUser, plan: 'premium', quotaLeft: 999 });
            alert('Selamat! Akun Guru Sultan Premium Anda telah aktif!');
            setIsPricingOpen(false);
          } else {
            setIsAuthOpen(true);
          }
        }}
      />

      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ isOpen: false, doc: null, shareUrl: '' })}
        document={shareData.doc}
        shareUrl={shareData.shareUrl}
      />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
