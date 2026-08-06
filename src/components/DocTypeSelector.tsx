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

export const DOC_OPTIONS: DocOption[] = [
  {
    type: 'modul_ajar',
    title: 'Modul Ajar',
    badge: 'Paling Populer',
    description: 'Format standar resmi Kemendikbudristek & KBC Kemenag lengkap 8 komponen utama.',
    icon: FileText,
    color: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-indigo-600',
    features: ['Capaian & Tujuan Pembelajaran', 'Deep Learning 6E / PBL / PjBL', 'Pertanyaan Pemantik & Asesmen'],
  },
  {
    type: 'lkpd',
    title: 'LKPD (Lembar Kerja)',
    badge: 'Praktis & Siswa',
    description: 'Lembar kerja eksplorasi interaktif dengan tugas mandiri/kelompok & ruang refleksi.',
    icon: FileSpreadsheet,
    color: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-teal-600',
    features: ['Petunjuk Kerja Siswa', 'Studi Kasus Kontekstual', 'Pertanyaan Analitis & Refleksi'],
  },
  {
    type: 'soal_hots',
    title: 'Generator Soal HOTS',
    badge: 'Kisi-Kisi + Pembahasan',
    description: 'Buat bank soal Pilihan Ganda & Esai berlevel Bloom Taxonomy C4–C6 beserta kunci jawaban.',
    icon: FileQuestion,
    color: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-fuchsia-600',
    features: ['Tabel Kisi-Kisi Soal Resmi', 'Tingkat Kesulitan HOTS', 'Kunci & Pembahasan Konseptual'],
  },
  {
    type: 'rubrik',
    title: 'Rubrik Penilaian',
    badge: 'Formatif & Sumatif',
    description: 'Rubrik penilaian kualitatif untuk presentasi, proyek kelompok, diskusi, dan portofolio.',
    icon: Award,
    color: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-600',
    features: ['Skala Kriteria 1 - 4', 'Deskriptor Perilaku Konkret', 'Matriks Penilaian Cepat'],
  },
  {
    type: 'atp_prota_prosem',
    title: 'ATP, Prota, & Prosem',
    badge: 'Perencanaan Tahunan',
    description: 'Alur Tujuan Pembelajaran (ATP), Program Tahunan, dan Program Semester otomatis.',
    icon: CalendarDays,
    color: 'text-sky-600 dark:text-sky-400',
    gradient: 'from-sky-500 to-cyan-600',
    features: ['Pemetaan JP per Bab/Semester', 'Urutan Alur Logis TP', 'Tabel Matriks Mingguan'],
  },
  {
    type: 'modul_p5',
    title: 'Modul Kokulikuler',
    badge: 'Profil Lulusan',
    description: 'Modul Kokulikuler Penguatan Profil Lulusan & Pendidikan Agama Kemenag.',
    icon: Sparkles,
    color: 'text-rose-600 dark:text-rose-400',
    gradient: 'from-rose-500 to-pink-600',
    features: ['Target Dimensi & Elemen', 'Alur Aksi Nyata Kokulikuler', 'Instrumen Evaluasi Kokulikuler'],
  },
  {
    type: 'asesmen_diagnostik',
    title: 'Asesmen Diagnostik',
    badge: 'Pemetaan Awal',
    description: 'Instrumen pemetaan gaya belajar, kesiapan awal, dan kondisi non-kognitif siswa.',
    icon: ClipboardCheck,
    color: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-violet-600',
    features: ['Diagnostik Non-Kognitif', 'Tes Kesiapan Awal Bab', 'Pemetaan Gaya Belajar'],
  },
  {
    type: 'jurnal_harian',
    title: 'Jurnal Refleksi Mengajar',
    badge: 'Evaluasi Guru (4P)',
    description: 'Catatan harian kejadian kelas & refleksi model 4P (Peristiwa, Perasaan, Pembelajaran, Perubahan).',
    icon: BookOpenCheck,
    color: 'text-teal-600 dark:text-teal-400',
    gradient: 'from-teal-500 to-emerald-600',
    features: ['Pencatatan Kejadian Penting', 'Refleksi Model 4P Guru', 'Tindak Lanjut & Evaluasi'],
  },
];

export const DocTypeSelector: React.FC<DocTypeSelectorProps> = ({
  selectedDocType,
  onSelectDocType,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Langkah 1: Pilih Jenis Dokumen Pembelajaran
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Pilih jenis administrasi yang ingin dibuat otomatis oleh AI Gemini hari ini
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {DOC_OPTIONS.map((opt) => {
          const IconComp = opt.icon;
          const isSelected = selectedDocType === opt.type;

          return (
            <div
              key={opt.type}
              onClick={() => onSelectDocType(opt.type)}
              className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between group ${
                isSelected
                  ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm'
              }`}
            >
              {/* Top Row: Icon & Badge */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${opt.gradient} text-white flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {opt.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {opt.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {opt.description}
                </p>
              </div>

              {/* Bottom Features List */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <ul className="space-y-1 mb-2">
                  {opt.features.map((ft, fIdx) => (
                    <li key={fIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center space-x-1.5">
                      <CheckCircle2 className={`w-3 h-3 flex-shrink-0 ${opt.color}`} />
                      <span className="truncate">{ft}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className={`mt-2 text-[11px] font-bold flex items-center justify-between ${
                    isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                  }`}
                >
                  <span>{isSelected ? 'Terpilih' : 'Pilih Jenis Ini'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
