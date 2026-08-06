import React from 'react';
import { Crown, Check, Zap, ShieldCheck, X, Sparkles } from 'lucide-react';
import { TeacherProfile } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TeacherProfile | null;
  onUpgradeToPremium: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpgradeToPremium,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 no-print">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
            <Crown className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Paket Langganan Guru Indonesia
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tingkatkan produktivitas pembuatan Modul Ajar, LKPD & Bank Soal tanpa batas kuota dengan AI Gemini Pro
          </p>
        </div>

        {/* Plan comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Plan 1: Gratis */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Paket Pemula
              </span>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Akun Gratis
              </h3>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                Rp 0 <span className="text-xs font-normal text-slate-400">/ selamanya</span>
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Kuota 5 dokumen per bulan</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Format Modul Ajar & LKPD standar</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Unduh format Word (.docx)</span>
              </li>
            </ul>

            {currentUser?.plan === 'free' ? (
              <div className="py-2 text-center text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-xl">
                Paket Aktif Anda Saat Ini
              </div>
            ) : null}
          </div>

          {/* Plan 2: Guru Sultan (Premium) */}
          <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-50/30 dark:bg-amber-950/20 relative space-y-4">
            <span className="absolute -top-3 right-4 px-3 py-0.5 bg-amber-500 text-white font-bold text-[10px] rounded-full uppercase shadow">
              Rekomendasi Utama Guru
            </span>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Akses Tanpa Batas
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span>Guru Sultan Premium</span>
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
              </h3>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                Rp 29.000 <span className="text-xs font-normal text-slate-400">/ bulan</span>
              </p>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
              <li className="flex items-center space-x-2 font-bold">
                <Check className="w-4 h-4 text-amber-500 stroke-[3]" />
                <span>Dokumen UNLIMITED tanpa kuota</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-500" />
                <span>Akses Gemini 3.1 Pro Kecepatan Tinggi</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-500" />
                <span>Koleksi semua 50+ Template Siap Pakai</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-amber-500" />
                <span>Fitur AI Polish Perbaikan Bagian</span>
              </li>
            </ul>

            <button
              onClick={onUpgradeToPremium}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              Aktifkan Akses Premium Sultan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
