import React from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileQuestion,
  Award,
  CalendarDays,
  Sparkles,
  ClipboardCheck,
  BookOpenCheck,
  CheckCircle2,
  ArrowRight,
  ListTodo,
  Calculator,
  MonitorPlay,
  FolderKanban
} from 'lucide-react';
import { DocType } from '../types';

interface DocTypeSelectorProps {
  selectedDocType: DocType;
  onSelectDocType: (docType: DocType) => void;
}

interface DocOption {
  type: DocType;
  title: string;
  badge: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  features: string[];
}

interface DocCategory {
  title: string;
  description: string;
  icon: React.ElementType;
  options: DocOption[];
}

export const DOC_CATEGORIES: DocCategory[] = [
  {
    title: 'Administrasi Pembelajaran',
    description: 'Penyusunan RPP, Modul Ajar, Silabus, dan Program Pembelajaran.',
    icon: FolderKanban,
    options: [
      {
        type: 'modul_ajar',
        title: 'Modul Ajar / RPP',
        badge: 'Paling Populer',
        description: 'Format standar resmi Kemendikbudristek & KBC Kemenag lengkap komponen utama.',
        icon: FileText,
        color: 'text-blue-600 dark:text-blue-400',
        gradient: 'from-blue-500 to-indigo-600',
        features: ['Capaian Pembelajaran', 'Skenario Berdiferensiasi', 'Pertanyaan Pemantik'],
      },
      {
        type: 'lkpd',
        title: 'LKPD (Lembar Kerja)',
        badge: 'Praktis & Siswa',
        description: 'Lembar kerja eksplorasi interaktif dengan tugas mandiri/kelompok.',
        icon: FileSpreadsheet,
        color: 'text-emerald-600 dark:text-emerald-400',
        gradient: 'from-emerald-500 to-teal-600',
        features: ['Petunjuk Kerja', 'Studi Kasus Kontekstual', 'Tugas Analitis'],
      },
      {
        type: 'atp_prota_prosem',
        title: 'ATP, Prota, & Prosem',
        badge: 'Perencanaan',
        description: 'Alur Tujuan Pembelajaran dan pemetaan waktu mengajar otomatis.',
        icon: CalendarDays,
        color: 'text-sky-600 dark:text-sky-400',
        gradient: 'from-sky-500 to-cyan-600',
        features: ['Pemetaan JP', 'Alur Logis TP', 'Matriks Mingguan'],
      },
      {
        type: 'kktp',
        title: 'KKTP',
        badge: 'Kriteria Kelulusan',
        description: 'Kriteria Ketercapaian Tujuan Pembelajaran dengan rubrik deskriptif.',
        icon: ListTodo,
        color: 'text-cyan-600 dark:text-cyan-400',
        gradient: 'from-cyan-500 to-blue-600',
        features: ['Interval Nilai', 'Deskripsi Kompetensi', 'Indikator Keberhasilan'],
      }
    ]
  },
  {
    title: 'Evaluasi & Penilaian',
    description: 'Generasi kisi-kisi, bank soal, rubrik, dan instrumen asesmen.',
    icon: ClipboardCheck,
    options: [
      {
        type: 'soal_hots',
        title: 'Generator Soal HOTS',
        badge: 'Kisi-Kisi + Kunci',
        description: 'Bank soal Pilihan Ganda & Esai berlevel C4–C6 beserta pembahasan.',
        icon: FileQuestion,
        color: 'text-purple-600 dark:text-purple-400',
        gradient: 'from-purple-500 to-fuchsia-600',
        features: ['Tabel Kisi-Kisi', 'Pilihan Ganda & Esai', 'Kunci Jawaban'],
      },
      {
        type: 'rubrik',
        title: 'Rubrik Penilaian',
        badge: 'Kualitatif',
        description: 'Rubrik penilaian untuk presentasi, proyek, dan diskusi kelompok.',
        icon: Award,
        color: 'text-amber-600 dark:text-amber-400',
        gradient: 'from-amber-500 to-orange-600',
        features: ['Skala 1 - 4', 'Deskriptor Perilaku', 'Matriks Penilaian'],
      },
      {
        type: 'asesmen_diagnostik',
        title: 'Asesmen Diagnostik',
        badge: 'Pemetaan Awal',
        description: 'Instrumen tes kesiapan belajar dan kondisi non-kognitif siswa.',
        icon: ClipboardCheck,
        color: 'text-indigo-600 dark:text-indigo-400',
        gradient: 'from-indigo-500 to-violet-600',
        features: ['Tes Kognitif', 'Pemetaan Non-Kognitif', 'Gaya Belajar'],
      },
      {
        type: 'pengolahan_nilai',
        title: 'Pengolahan Nilai',
        badge: 'Otomatisasi',
        description: 'Format rekapitulasi daftar hadir dan analisis hasil penilaian otomatis.',
        icon: Calculator,
        color: 'text-green-600 dark:text-green-400',
        gradient: 'from-green-500 to-emerald-600',
        features: ['Format Excel-ready', 'Analisis Ketuntasan', 'Grafik Perkembangan'],
      }
    ]
  },
  {
    title: 'Administrasi Tambahan & Media',
    description: 'Modul P5, jurnal refleksi harian, dan draf media slide presentasi.',
    icon: Sparkles,
    options: [
      {
        type: 'jurnal_harian',
        title: 'Jurnal Refleksi',
        badge: 'Evaluasi Diri',
        description: 'Catatan harian kejadian kelas & refleksi model 4P.',
        icon: BookOpenCheck,
        color: 'text-teal-600 dark:text-teal-400',
        gradient: 'from-teal-500 to-emerald-600',
        features: ['Pencatatan Kejadian', 'Refleksi 4P', 'Tindak Lanjut'],
      },
      {
        type: 'modul_p5',
        title: 'Modul Kokulikuler (P5)',
        badge: 'Profil Lulusan',
        description: 'Modul proyek Penguatan Profil Lulusan & Pendidikan Agama Kemenag.',
        icon: Sparkles,
        color: 'text-rose-600 dark:text-rose-400',
        gradient: 'from-rose-500 to-pink-600',
        features: ['Target Dimensi', 'Alur Aksi Nyata', 'Instrumen Evaluasi'],
      },
      {
        type: 'slide_presentasi',
        title: 'Draf Slide Presentasi',
        badge: 'Media Ajar',
        description: 'Struktur dan outline materi siap pakai untuk desain di Canva/PowerPoint.',
        icon: MonitorPlay,
        color: 'text-orange-600 dark:text-orange-400',
        gradient: 'from-orange-500 to-amber-600',
        features: ['Struktur Slide', 'Ide Visual', 'Poin Presentasi Utama'],
      }
    ]
  }
];

export const DocTypeSelector: React.FC<DocTypeSelectorProps> = ({
  selectedDocType,
  onSelectDocType,
}) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Langkah 1: Pilih Kategori & Jenis Dokumen
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Pilih modul administrasi berdasarkan fungsi yang ingin disusun secara otomatis oleh AI Gemini
          </p>
        </div>
      </div>

      <div className="space-y-10">
        {DOC_CATEGORIES.map((category, idx) => {
          const CategoryIcon = category.icon;
          return (
            <div key={idx} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center space-x-2 border-b-2 border-slate-100 dark:border-slate-800 pb-3">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                  <CategoryIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">{category.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
              </div>
              
              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.options.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = selectedDocType === opt.type;

                  return (
                    <div
                      key={opt.type}
                      onClick={() => onSelectDocType(opt.type)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-900/20 border-blue-600 dark:border-blue-500 shadow-md shadow-blue-500/10 ring-4 ring-blue-500/10 scale-[1.02]'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
                      }`}
                    >
                      {/* Top Row: Icon & Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-4">
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${opt.gradient} text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        </div>

                        {/* Title & Desc */}
                        <h4 className={`font-bold text-sm mb-1.5 transition-colors ${
                          isSelected ? 'text-blue-800 dark:text-blue-300' : 'text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                        }`}>
                          {opt.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                          {opt.description}
                        </p>
                      </div>

                      {/* Bottom Features List */}
                      <div className={`pt-3 border-t ${isSelected ? 'border-blue-200 dark:border-blue-800/50' : 'border-slate-100 dark:border-slate-700/60'}`}>
                        <ul className="space-y-1.5 mb-3">
                          {opt.features.map((ft, fIdx) => (
                            <li key={fIdx} className={`text-[11px] flex items-center space-x-2 ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-300'}`}>
                              <CheckCircle2 className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : opt.color}`} />
                              <span className="truncate font-medium">{ft}</span>
                            </li>
                          ))}
                        </ul>

                        <div
                          className={`mt-3 text-[11px] font-extrabold flex items-center justify-between px-3 py-2 rounded-lg ${
                            isSelected 
                              ? 'bg-blue-600 text-white shadow-sm' 
                              : 'bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                          }`}
                        >
                          <span>{isSelected ? 'Modul Terpilih' : 'Pilih Modul Ini'}</span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
