import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  School,
  Clock,
  UserCheck,
  Zap,
  Check,
  Layers,
  ListChecks,
  HelpCircle,
  FileQuestion,
  Loader2,
  Wand2,
  Cpu,
  Monitor,
  Compass,
  FileSpreadsheet,
  FileCode,
  Layout,
  CheckSquare,
} from 'lucide-react';
import {
  DocType,
  CurriculumType,
  LearningModel,
  SpecialApproach,
  DocFormData,
  TeacherProfile,
} from '../types';

interface DocGeneratorFormProps {
  selectedDocType: DocType;
  onSubmit: (formData: DocFormData) => void;
  isLoading: boolean;
  currentUser: TeacherProfile | null;
  initialFormData?: Partial<DocFormData>;
}

const POPULAR_SUBJECTS = [
  'Ilmu Pengetahuan Alam (IPA)',
  'Matematika',
  'Bahasa Indonesia',
  'IPAS (IPA & IPS)',
  'Bahasa Inggris',
  'Pendidikan Pancasila',
  'PAI dan Budi Pekerti',
  'PJOK',
  'Informatika',
  'Seni Budaya',
  'Fisika',
  'Kimia',
  'Biologi',
  'Sejarah',
  'Ekonomi',
  'Geografi',
];

const GRADES_PHASES = [
  'Fase A (Kelas 1 - 2 SD)',
  'Fase B (Kelas 3 - 4 SD)',
  'Fase C (Kelas 5 - 6 SD)',
  'Fase D (Kelas 7 - 9 SMP)',
  'Fase E (Kelas 10 SMA/SMK)',
  'Fase F (Kelas 11 - 12 SMA/SMK)',
  'PAUD / TK',
  'Madrasah Ibtidaiyah (MI)',
  'Madrasah Tsanawiyah (MTs)',
  'Madrasah Aliyah (MA)',
];

const LEARNING_MODELS: LearningModel[] = [
  'Deep Learning (6E / Practical)',
  'Problem-Based Learning (PBL)',
  'Project-Based Learning (PjBL)',
  'Discovery Learning',
  'Inquiry Learning',
  'Pembelajaran Berdiferensiasi',
  'Cooperative Learning (STAD/Jigsaw)',
  'Game-Based Learning',
];

const SPECIAL_APPROACHES: { type: SpecialApproach; label: string; desc: string }[] = [
  { type: 'Standar', label: 'Standar Merdeka', desc: 'Pendekatan umum Kurikulum Merdeka' },
  { type: 'Diferensiasi', label: 'Pembelajaran Berdiferensiasi', desc: 'Gaya belajar visual, auditori, kinestetik' },
  { type: 'Integrasi Koding & Kecerdasan Artificial (KKA)', label: 'Integrasi KKA (Koding & AI)', desc: 'Pengenalan logika koding & pemanfaatan AI' },
  { type: 'Papan Interaktif Digital (PID)', label: 'Papan Interaktif Digital (PID)', desc: 'Optimalisasi media layar digital & Canva/Quizizz' },
  { type: 'STEM', label: 'Pendekatan STEM', desc: 'Sains, Teknologi, Rekayasa, dan Matematika' },
];

// 8 Dimensi Profil Lulusan resmi
const DIMENSI_PROFIL_LULUSAN = [
  { id: 'Keimanan dan Ketakwaan', label: 'Keimanan dan Ketakwaan kepada Tuhan YME & Akhlak Mulia' },
  { id: 'Kewargaan', label: 'Kewargaan & Kebinekaan' },
  { id: 'Penalaran Kritis', label: 'Penalaran Kritis' },
  { id: 'Kreativitas', label: 'Kreativitas & Inovasi' },
  { id: 'Kolaborasi', label: 'Kolaborasi & Gotong Royong' },
  { id: 'Kemandirian', label: 'Kemandirian' },
  { id: 'Kesehatan', label: 'Kesehatan Jasmani & Mental' },
  { id: 'Komunikasi', label: 'Komunikasi & Literasi' },
];

const P5_THEMES = [
  'Gaya Hidup Berkelanjutan',
  'Kearifan Lokal',
  'Bhinneka Tunggal Ika',
  'Bangunlah Jiwa dan Raganya',
  'Suara Demokrasi',
  'Rekayasa dan Teknologi',
  'Kewirausahaan',
  'Pendidikan Agama & Akhlak (PPA Kemenag)',
];

export const DocGeneratorForm: React.FC<DocGeneratorFormProps> = ({
  selectedDocType,
  onSubmit,
  isLoading,
  currentUser,
  initialFormData,
}) => {
  const [curriculum, setCurriculum] = useState<CurriculumType>('merdeka');
  const [mataPelajaran, setMataPelajaran] = useState<string>('Ilmu Pengetahuan Alam (IPA)');
  const [jenjangKelas, setJenjangKelas] = useState<string>('Fase B (Kelas 3 - 4 SD)');
  const [topikMateri, setTopikMateri] = useState<string>('Mengenal Rantai Makanan & Keseimbangan Ekosistem');
  const [alokasiWaktu, setAlokasiWaktu] = useState<string>('2 JP x 35 Menit (1 Pertemuan)');
  const [jumlahPertemuan, setJumlahPertemuan] = useState<number>(1);
  const [modelPembelajaran, setModelPembelajaran] = useState<LearningModel>('Deep Learning (6E / Practical)');
  const [pendekatanKhusus, setPendekatanKhusus] = useState<SpecialApproach>('Integrasi Koding & Kecerdasan Artificial (KKA)');
  const [tujuanPembelajaranCustom, setTujuanPembelajaranCustom] = useState<string>(
    'Peserta didik dapat menganalisis peran produsen, konsumen, dan pengurai dalam rantai makanan serta mensimulasikan keseimbangan ekosistem.'
  );
  const [detailMateri, setDetailMateri] = useState<string>(
    'Komponen ekosistem (biotik & abiotik), rantai makanan, jejaring makanan, dan dampak perubahan lingkungan.'
  );
  const [karakteristikSiswa, setKarakteristikSiswa] = useState<string>(
    'Siswa aktif, menyukai visual digital, diskusi kelompok, dan eksperimen sederhana.'
  );
  const [saranaPrasarana, setSaranaPrasarana] = useState<string>(
    'Proyektor, Papan Interaktif Digital, Kartu Gambar, Laptop, LKPD Digital'
  );

  // Default 4 Dimensi Profil Lulusan selected
  const [dimensiProfilLulusan, setDimensiProfilLulusan] = useState<string[]>([
    'Penalaran Kritis',
    'Kreativitas',
    'Kolaborasi',
    'Kemandirian',
  ]);

  const [orientasiHalaman, setOrientasiHalaman] = useState<'portrait' | 'landscape'>('portrait');
  const [tampilkanPengesahan, setTampilkanPengesahan] = useState<boolean>(true);
  const [kepalaSekolah, setKepalaSekolah] = useState<string>('I Wayan Sutarja, M.Pd.');
  const [nipKepala, setNipKepala] = useState<string>('197803152005011008');

  // Specific doc type fields
  const [jumlahSoal, setJumlahSoal] = useState<number>(10);
  const [levelKesulitan, setLevelKesulitan] = useState<'Mudah' | 'Sedang' | 'Tinggi (HOTS)' | 'Campuran'>('Tinggi (HOTS)');
  const [tipeSoal, setTipeSoal] = useState<'Pilihan Ganda' | 'Esai' | 'Campuran (PG + Esai)'>('Campuran (PG + Esai)');
  const [jenisRubrik, setJenisRubrik] = useState<'Presentasi' | 'Proyek' | 'Portofolio' | 'Diskusi Kelompok'>('Presentasi');
  const [temaP5, setTemaP5] = useState<string>('Gaya Hidup Berkelanjutan');

  // Load initial form data or user defaults if provided
  useEffect(() => {
    if (currentUser) {
      if (currentUser.sekolah) {
        // preserve
      }
      if (currentUser.kepalaSekolah) setKepalaSekolah(currentUser.kepalaSekolah);
      if (currentUser.nipKepala) setNipKepala(currentUser.nipKepala);
    }
  }, [currentUser]);

  useEffect(() => {
    if (initialFormData) {
      if (initialFormData.curriculum) setCurriculum(initialFormData.curriculum);
      if (initialFormData.mataPelajaran) setMataPelajaran(initialFormData.mataPelajaran);
      if (initialFormData.jenjangKelas) setJenjangKelas(initialFormData.jenjangKelas);
      if (initialFormData.topikMateri) setTopikMateri(initialFormData.topikMateri);
      if (initialFormData.alokasiWaktu) setAlokasiWaktu(initialFormData.alokasiWaktu);
      if (initialFormData.jumlahPertemuan) setJumlahPertemuan(initialFormData.jumlahPertemuan);
      if (initialFormData.modelPembelajaran) setModelPembelajaran(initialFormData.modelPembelajaran);
      if (initialFormData.pendekatanKhusus) setPendekatanKhusus(initialFormData.pendekatanKhusus);
      if (initialFormData.tujuanPembelajaranCustom) setTujuanPembelajaranCustom(initialFormData.tujuanPembelajaranCustom);
      if (initialFormData.detailMateri) setDetailMateri(initialFormData.detailMateri);
      if (initialFormData.karakteristikSiswa) setKarakteristikSiswa(initialFormData.karakteristikSiswa);
      if (initialFormData.saranaPrasarana) setSaranaPrasarana(initialFormData.saranaPrasarana);
      if (initialFormData.dimensiProfilLulusan) setDimensiProfilLulusan(initialFormData.dimensiProfilLulusan);
      if (initialFormData.orientasiHalaman) setOrientasiHalaman(initialFormData.orientasiHalaman);
      if (initialFormData.tampilkanPengesahan !== undefined) setTampilkanPengesahan(initialFormData.tampilkanPengesahan);
      if (initialFormData.jumlahSoal) setJumlahSoal(initialFormData.jumlahSoal);
      if (initialFormData.levelKesulitan) setLevelKesulitan(initialFormData.levelKesulitan);
      if (initialFormData.tipeSoal) setTipeSoal(initialFormData.tipeSoal);
      if (initialFormData.jenisRubrik) setJenisRubrik(initialFormData.jenisRubrik);
      if (initialFormData.temaP5) setTemaP5(initialFormData.temaP5);
    }
  }, [initialFormData, selectedDocType]);

  const toggleDimensi = (dimId: string) => {
    if (dimensiProfilLulusan.includes(dimId)) {
      if (dimensiProfilLulusan.length <= 1) return; // minimal 1
      setDimensiProfilLulusan(dimensiProfilLulusan.filter((d) => d !== dimId));
    } else {
      setDimensiProfilLulusan([...dimensiProfilLulusan, dimId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: DocFormData = {
      docType: selectedDocType,
      curriculum,
      mataPelajaran,
      jenjangKelas,
      topikMateri,
      alokasiWaktu,
      jumlahPertemuan,
      modelPembelajaran,
      pendekatanKhusus,
      tujuanPembelajaranCustom,
      dimensiProfilLulusan,
      detailMateri,
      karakteristikSiswa,
      saranaPrasarana,
      orientasiHalaman,
      tampilkanPengesahan,
      kepalaSekolah,
      nipKepala,
      jumlahSoal,
      levelKesulitan,
      tipeSoal,
      jenisRubrik,
      temaP5,
      authorName: currentUser?.name || 'Ni Made Sri Wahyuni, S.Pd.',
      authorSchool: currentUser?.sekolah || 'SD Negeri 07 Pedungan',
      authorNip: currentUser?.nip || '198504122010012015',
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-5 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Langkah 2: Parameter Pembelajaran Kurikulum Merdeka</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lengkapi data pembelajaran berikut agar AI menyusun dokumen resmi yang presisi & kontekstual
          </p>
        </div>

        {currentUser && (
          <div className="text-left sm:text-right bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-900/60">
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase">Guru & Sekolah:</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {currentUser.name} ({currentUser.sekolah})
            </p>
          </div>
        )}
      </div>

      {/* Row 1: Kurikulum & Mata Pelajaran */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Pedoman / Pedoman Kurikulum
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setCurriculum('merdeka')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                curriculum === 'merdeka'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              Kurikulum Merdeka
            </button>

            <button
              type="button"
              onClick={() => setCurriculum('kbc_kemenag')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                curriculum === 'kbc_kemenag'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              KBC Kemenag
            </button>

            <button
              type="button"
              onClick={() => setCurriculum('k13')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                curriculum === 'k13'
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              Kurikulum 2013
            </button>
          </div>
        </div>

        {/* Mata Pelajaran */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Mata Pelajaran
          </label>
          <input
            type="text"
            required
            value={mataPelajaran}
            onChange={(e) => setMataPelajaran(e.target.value)}
            placeholder="Contoh: Ilmu Pengetahuan Alam (IPA) / Informatika / Matematika"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex flex-wrap gap-1.5 mt-2">
            {POPULAR_SUBJECTS.slice(0, 6).map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setMataPelajaran(subj)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              >
                + {subj}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Jenjang Kelas & Topik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Jenjang & Kelas / Fase
          </label>
          <select
            value={jenjangKelas}
            onChange={(e) => setJenjangKelas(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {GRADES_PHASES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Topik / Materi Pokok Pembelajaran
          </label>
          <input
            type="text"
            required
            value={topikMateri}
            onChange={(e) => setTopikMateri(e.target.value)}
            placeholder="Contoh: Rantai Makanan & Keseimbangan Ekosistem"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Row 3: Model Pembelajaran & Pendekatan Khusus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Model Pembelajaran Utama
          </label>
          <select
            value={modelPembelajaran}
            onChange={(e) => setModelPembelajaran(e.target.value as LearningModel)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LEARNING_MODELS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Pendekatan Khusus */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Pendekatan Khusus Pembelajaran
          </label>
          <select
            value={pendekatanKhusus}
            onChange={(e) => setPendekatanKhusus(e.target.value as SpecialApproach)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {SPECIAL_APPROACHES.map((app) => (
              <option key={app.type} value={app.type}>
                {app.label} — ({app.desc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 4: Tujuan Pembelajaran & Detail Rincian Materi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Tujuan Pembelajaran (TP Spesifik)
          </label>
          <textarea
            rows={3}
            value={tujuanPembelajaranCustom}
            onChange={(e) => setTujuanPembelajaranCustom(e.target.value)}
            placeholder="Biarkan atau ketik TP khusus Anda..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Detail / Rincian Materi Pokok
          </label>
          <textarea
            rows={3}
            value={detailMateri}
            onChange={(e) => setDetailMateri(e.target.value)}
            placeholder="Sub-topik, istilah penting, atau poin ringkasan materi..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Row 5: Alokasi Waktu & Jumlah Pertemuan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Alokasi Waktu
          </label>
          <input
            type="text"
            value={alokasiWaktu}
            onChange={(e) => setAlokasiWaktu(e.target.value)}
            placeholder="Contoh: 2 JP x 35 Menit (1 Pertemuan)"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Jumlah Pertemuan
          </label>
          <input
            type="number"
            min={1}
            max={12}
            value={jumlahPertemuan}
            onChange={(e) => setJumlahPertemuan(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Specific Fields for Generator Soal / Rubrik / P5 */}
      {selectedDocType === 'soal_hots' && (
        <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center space-x-2">
            <FileQuestion className="w-4 h-4 text-purple-600" />
            <span>Pengaturan Spesifik Generator Soal HOTS</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Jumlah Soal
              </label>
              <input
                type="number"
                min={3}
                max={25}
                value={jumlahSoal}
                onChange={(e) => setJumlahSoal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Level Kesulitan
              </label>
              <select
                value={levelKesulitan}
                onChange={(e) => setLevelKesulitan(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              >
                <option value="Mudah">Mudah (C1 - C2)</option>
                <option value="Sedang">Sedang (C3)</option>
                <option value="Tinggi (HOTS)">Tinggi (HOTS C4 - C6)</option>
                <option value="Campuran">Campuran Berjenjang</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tipe Soal
              </label>
              <select
                value={tipeSoal}
                onChange={(e) => setTipeSoal(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
              >
                <option value="Pilihan Ganda">Pilihan Ganda (Opsi A-D)</option>
                <option value="Esai">Esai Uraian Analitis</option>
                <option value="Campuran (PG + Esai)">Campuran (PG + Esai)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {selectedDocType === 'rubrik' && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-amber-900 dark:text-amber-300">
            Fokus Jenis Rubrik Penilaian
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Presentasi', 'Proyek', 'Portofolio', 'Diskusi Kelompok'] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setJenisRubrik(r)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors ${
                  jenisRubrik === r
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDocType === 'modul_p5' && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl space-y-3">
          <label className="block text-xs font-bold text-rose-900 dark:text-rose-300">
            Pilih Tema Modul Kokulikuler / PPA Kemenag
          </label>
          <select
            value={temaP5}
            onChange={(e) => setTemaP5(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
          >
            {P5_THEMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Row 6: 8 Dimensi Profil Lulusan (Select at least 4) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Dimensi Profil Lulusan (Pilih minimal 4 dimensi utama)
          </label>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md">
            Terpilih: {dimensiProfilLulusan.length} / 8
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {DIMENSI_PROFIL_LULUSAN.map((dim) => {
            const isChecked = dimensiProfilLulusan.includes(dim.id);
            return (
              <div
                key={dim.id}
                onClick={() => toggleDimensi(dim.id)}
                className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center space-x-2.5 ${
                  isChecked
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                    isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="truncate text-[11px]">{dim.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 7: Condition of Students & Facilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Karakteristik Peserta Didik (Opsional)
          </label>
          <textarea
            rows={2}
            value={karakteristikSiswa}
            onChange={(e) => setKarakteristikSiswa(e.target.value)}
            placeholder="Contoh: Siswa cenderung audio-visual, aktif bertanya, 3 siswa butuh bimbingan membaca..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Sarana & Prasarana Pendukung (Opsional)
          </label>
          <textarea
            rows={2}
            value={saranaPrasarana}
            onChange={(e) => setSaranaPrasarana(e.target.value)}
            placeholder="Contoh: Laptop, LCD Proyektor, Papan Interaktif Digital, Kartu Gambar, LKPD..."
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Row 8: Layout Orientation & Validation Columns */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
          <Layout className="w-4 h-4 text-blue-600" />
          <span>Pengaturan Layout Halaman & Kolom Pengesahan Dokumen Word</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Orientation */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Orientasi Halaman Export Word
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOrientasiHalaman('portrait')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  orientasiHalaman === 'portrait'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Potrait (Tegak)
              </button>
              <button
                type="button"
                onClick={() => setOrientasiHalaman('landscape')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  orientasiHalaman === 'landscape'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                Landscape (Mendatar)
              </button>
            </div>
          </div>

          {/* Pengesahan Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Kolom Pengesahan Kepala Sekolah & Guru
              </label>
              <input
                type="checkbox"
                checked={tampilkanPengesahan}
                onChange={(e) => setTampilkanPengesahan(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            {tampilkanPengesahan && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={kepalaSekolah}
                  onChange={(e) => setKepalaSekolah(e.target.value)}
                  placeholder="Nama Kepala Sekolah"
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px]"
                />
                <input
                  type="text"
                  value={nipKepala}
                  onChange={(e) => setNipKepala(e.target.value)}
                  placeholder="NIP Kepala Sekolah"
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Submit Button */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          ✨ Menggunakan <strong className="text-slate-800 dark:text-slate-200">Gemini 2.0 Flash AI Engine</strong> untuk format resmi Kurikulum Merdeka.
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2.5 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI Memproses Dokumen Kurikulum (15-30 dtk)...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generasi Dokumen Pembelajaran Otomatis</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
