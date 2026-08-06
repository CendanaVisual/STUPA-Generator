import React from 'react';
import {
  Sparkles,
  BookOpen,
  History,
  LayoutGrid,
  Crown,
  Sun,
  Moon,
  User,
  LogOut,
  GraduationCap,
  FileCheck2,
} from 'lucide-react';
import { TeacherProfile } from '../types';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  currentUser: TeacherProfile | null;
  activeTab: 'create' | 'templates' | 'history' | 'pricing';
  setActiveTab: (tab: 'create' | 'templates' | 'history' | 'pricing') => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  setDarkMode,
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onSignOut,
  onOpenPricing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => setActiveTab('create')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-500 dark:from-blue-400 dark:via-indigo-300 dark:to-sky-400 bg-clip-text text-transparent">
                  STUPA GENERATOR
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  v2.5 Merdeka & KBC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Platform AI Administrasi Guru Otomatis Indonesia
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Dokumen</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Template Siap Pakai</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Riwayat Dokumen</span>
            </button>

            <button
              onClick={onOpenPricing}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'pricing'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Paket Langganan</span>
            </button>
          </nav>

          {/* User & Controls Right */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Ganti Tema Gelap/Terang"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Quota Badge */}
            {currentUser && (
              <button
                onClick={onOpenPricing}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>
                  Kuota: <strong className="font-bold">{currentUser.plan === 'premium' ? '∞ Unlimited' : `${currentUser.quotaLeft} Dokumen`}</strong>
                </span>
              </button>
            )}

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white dark:ring-slate-800 shadow-sm overflow-hidden">
                    {currentUser.picture ? (
                      <img src={currentUser.picture} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                      {currentUser.sekolah}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <User className="w-4 h-4" />
                <span>Masuk Guru</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'create' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buat</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'templates' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Template</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'history' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Riwayat</span>
          </button>

          <button
            onClick={onOpenPricing}
            className={`flex items-center space-x-1 py-1 px-2.5 rounded-lg ${
              activeTab === 'pricing' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Paket</span>
          </button>
        </div>
      </div>
    </header>
  );
};
