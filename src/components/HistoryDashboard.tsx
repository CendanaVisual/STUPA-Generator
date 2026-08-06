import React, { useState } from 'react';
import {
  FileText,
  Clock,
  Sparkles,
  Search,
  Download,
  Trash2,
  Eye,
  Share2,
  Plus,
  BookOpen,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { GeneratedDocument, DocType, TeacherProfile } from '../types';

interface HistoryDashboardProps {
  history: GeneratedDocument[];
  currentUser: TeacherProfile | null;
  onViewDoc: (doc: GeneratedDocument) => void;
  onDeleteDoc: (id: string) => void;
  onShareDoc: (doc: GeneratedDocument) => void;
  onCreateNew: () => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  history,
  currentUser,
  onViewDoc,
  onDeleteDoc,
  onShareDoc,
  onCreateNew,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDocType, setFilterDocType] = useState<string>('all');

  const filteredHistory = history.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.mataPelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.topikMateri.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterDocType === 'all' || doc.docType === filterDocType;

    return matchesSearch && matchesFilter;
  });

  const totalTimeSavedHours = history.length * 2.5; // Estimasi 2.5 jam per dokumen RPP

  return (
    <div className="space-y-6">
      {/* Analytics Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Dokumen Dibuat</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {history.length} <span className="text-xs font-normal text-slate-400">Modul</span>
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimasi Waktu Dihemat</p>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              ± {totalTimeSavedHours.toFixed(1)} <span className="text-xs font-normal text-slate-400">Jam Kerja</span>
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Status Akun Guru</p>
            <h3 className="text-sm font-extrabold text-purple-700 dark:text-purple-300 uppercase">
              {currentUser?.plan === 'premium' ? 'Guru Sultan (Premium)' : 'Gratis (5/bln)'}
            </h3>
          </div>
        </div>

        <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-5 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-100 font-medium">Buat Dokumen Baru?</p>
            <p className="text-xs font-bold text-white mt-0.5">Generasi AI Instan</p>
          </div>
          <button
            onClick={onCreateNew}
            className="p-2.5 bg-white text-blue-600 rounded-xl font-bold shadow hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History List & Filter */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Daftar Riwayat Dokumen
          </h3>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari mata pelajaran / topik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter doc type */}
            <select
              value={filterDocType}
              onChange={(e) => setFilterDocType(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Jenis Dokumen</option>
              <option value="modul_ajar">Modul Ajar</option>
              <option value="lkpd">LKPD</option>
              <option value="soal_hots">Soal HOTS</option>
              <option value="rubrik">Rubrik Penilaian</option>
              <option value="modul_p5">Modul Kokulikuler</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum Ada Dokumen Tersimpan</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mulai generasi Modul Ajar pertama Anda dengan tombol "Buat Dokumen Baru" di atas.
            </p>
            <button
              onClick={onCreateNew}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow hover:bg-blue-700 transition-colors inline-flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Dokumen Pertama</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredHistory.map((doc) => (
              <div key={doc.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 px-3 rounded-2xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 uppercase">
                      {doc.docType.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {doc.mataPelajaran} • {doc.jenjangKelas} • Topik: {doc.topikMateri}
                  </p>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => onViewDoc(doc)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-colors text-xs font-bold flex items-center space-x-1"
                    title="Buka Dokumen"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Buka</span>
                  </button>

                  <button
                    onClick={() => onShareDoc(doc)}
                    className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    title="Bagikan Tautan"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteDoc(doc.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors"
                    title="Hapus Dari Riwayat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
