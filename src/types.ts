export type DocType = 
  | 'modul_ajar' // Modul Ajar
  | 'lkpd'
  | 'soal_hots'
  | 'rubrik'
  | 'atp_prota_prosem'
  | 'modul_p5'
  | 'asesmen_diagnostik'
  | 'jurnal_harian'
  | 'kktp'
  | 'pengolahan_nilai'
  | 'slide_presentasi';

export type CurriculumType = 'merdeka' | 'kbc_kemenag' | 'k13';

export type LearningModel = 
  | 'Deep Learning (6E / Practical)'
  | 'Problem-Based Learning (PBL)'
  | 'Project-Based Learning (PjBL)'
  | 'Discovery Learning'
  | 'Inquiry Learning'
  | 'Pembelajaran Berdiferensiasi'
  | 'Cooperative Learning (STAD/Jigsaw)'
  | 'Game-Based Learning';

export type SpecialApproach = 
  | 'Standar'
  | 'Diferensiasi'
  | 'Integrasi Koding & Kecerdasan Artificial (KKA)'
  | 'Papan Interaktif Digital (PID)'
  | 'STEM';

export interface TeacherProfile {
  id: string;
  email: string;
  name: string;
  nip?: string;
  sekolah: string;
  kepalaSekolah?: string;
  nipKepala?: string;
  mataPelajaranUtama: string;
  picture?: string;
  joinedAt: string;
  plan: 'free' | 'premium';
  quotaLeft: number;
}

export interface DocFormData {
  docType: DocType;
  curriculum: CurriculumType;
  mataPelajaran: string;
  jenjangKelas: string;
  topikMateri: string;
  alokasiWaktu: string;
  jumlahPertemuan: number;
  modelPembelajaran: LearningModel;
  pendekatanKhusus: SpecialApproach;
  tujuanPembelajaranCustom?: string;
  dimensiProfilLulusan: string[];
  detailMateri?: string;
  karakteristikSiswa?: string;
  saranaPrasarana?: string;
  orientasiHalaman: 'portrait' | 'landscape';
  tampilkanPengesahan: boolean;
  kepalaSekolah?: string;
  nipKepala?: string;
  
  // Doc-specific fields
  jumlahSoal?: number;
  levelKesulitan?: 'Mudah' | 'Sedang' | 'Tinggi (HOTS)' | 'Campuran';
  tipeSoal?: 'Pilihan Ganda' | 'Esai' | 'Campuran (PG + Esai)';
  jenisRubrik?: 'Presentasi' | 'Proyek' | 'Portofolio' | 'Diskusi Kelompok';
  temaP5?: string;
  authorName?: string;
  authorSchool?: string;
  authorNip?: string;
}

export interface DocSection {
  id: string;
  title: string;
  content: string; // Markdown or plain text
  type?: 'text' | 'table' | 'list';
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface GeneratedDocument {
  id: string;
  docType: DocType;
  title: string;
  curriculum: CurriculumType;
  mataPelajaran: string;
  jenjangKelas: string;
  topikMateri: string;
  orientasiHalaman?: 'portrait' | 'landscape';
  tampilkanPengesahan?: boolean;
  authorName: string;
  authorSchool: string;
  authorNip?: string;
  kepalaSekolah?: string;
  nipKepala?: string;
  createdAt: string;
  sections: DocSection[];
  summary: string;
  tags: string[];
}

export interface DocumentTemplate {
  id: string;
  title: string;
  docType: DocType;
  subject: string;
  grade: string;
  description: string;
  icon: string;
  formData: Partial<DocFormData>;
}
