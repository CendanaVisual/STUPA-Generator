import { GoogleGenAI } from '@google/genai';
import { DocFormData, GeneratedDocument, DocSection } from '../types';

// Client-side Gemini API key from Vite environment variable
const getApiKey = (): string | null => {
  try {
    return import.meta.env.VITE_GEMINI_API_KEY || null;
  } catch {
    return null;
  }
};

const getGeminiClient = (): GoogleGenAI | null => {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const generateDocumentWithAI = async (formData: DocFormData): Promise<GeneratedDocument> => {
  const {
    docType = 'modul_ajar',
    curriculum = 'merdeka',
    mataPelajaran = 'Ilmu Pengetahuan Alam (IPA)',
    jenjangKelas = 'Fase B (Kelas 4 SD)',
    topikMateri = 'Rantai Makanan & Ekosistem',
    alokasiWaktu = '2 JP (70 Menit)',
    jumlahPertemuan = 1,
    modelPembelajaran = 'Deep Learning (6E / Practical)',
    pendekatanKhusus = 'Integrasi Koding & Kecerdasan Artificial (KKA)',
    tujuanPembelajaranCustom = '',
    detailMateri = '',
    karakteristikSiswa = 'Aktif & Menyukai Visual Digital',
    saranaPrasarana = 'Proyektor, Laptop, LKPD',
    dimensiProfilLulusan = ['Penalaran Kritis', 'Kreativitas', 'Kolaborasi', 'Kemandirian'],
    orientasiHalaman = 'portrait',
    tampilkanPengesahan = true,
    jumlahSoal = 10,
    levelKesulitan = 'Tinggi (HOTS)',
    tipeSoal = 'Campuran',
    jenisRubrik = 'Presentasi',
    temaP5 = 'Gaya Hidup Berkelanjutan',
    authorName = 'Ni Made Sri Wahyuni, S.Pd.',
    authorSchool = 'SD Negeri 07 Pedungan',
    authorNip = '198504122010012015',
    kepalaSekolah = 'I Wayan Sutarja, M.Pd.',
    nipKepala = '197803152005011008',
  } = formData;

  const ai = getGeminiClient();

  if (!ai) {
    // No API key — return fallback document
    return createFallbackDocument(formData);
  }

  try {
    const systemPrompt = `Anda adalah Pakar Administrasi Pendidikan Indonesia & Konsultan Senior Kemendikbudristek khusus Kurikulum Merdeka dan KBC (Kurikulum Berbasis Cinta) Kemenag.
Tugas Anda adalah memproduksi dokumen pembelajaran "${docType.toUpperCase()}" yang SANGAT DETAIL, PROFESSIONAL, TIDAK GENERIK, dan 100% SESUAI STANDAR RESMI KEMENDIKBUDRISTEK.

PANDUAN PARAMETER KURIKULUM:
- Pedoman: ${curriculum === 'kbc_kemenag' ? 'Kurikulum Berbasis Cinta (KBC Kemenag RI)' : 'Kurikulum Merdeka (Kemendikbudristek RI)'}
- Mata Pelajaran: ${mataPelajaran}
- Jenjang & Kelas/Fase: ${jenjangKelas}
- Topik / Materi Pokok: ${topikMateri}
- Rincian Sub-Materi: ${detailMateri || 'Materi lengkap terkait topik'}
- Alokasi Waktu: ${alokasiWaktu} (${jumlahPertemuan} Pertemuan)
- Model Pembelajaran: ${modelPembelajaran}
- Pendekatan Khusus: ${pendekatanKhusus}
- Tujuan Pembelajaran Spesifik (TP): ${tujuanPembelajaranCustom || 'Diuraikan otomatis berbasis Capaian Pembelajaran'}
- Karakteristik Peserta Didik: ${karakteristikSiswa}
- Sarana & Prasarana: ${saranaPrasarana}
- Dimensi Profil Lulusan (Minimal 4): ${Array.isArray(dimensiProfilLulusan) ? dimensiProfilLulusan.join(', ') : dimensiProfilLulusan}

PENTING & DILARANG:
1. DILARANG menggunakan kata placeholder seperti "[Isi di sini]", "...", atau "dst". Setiap deskripsi kegiatan harus operasional dan siap digunakan di kelas.
2. Integrasikan ciri khas pendekatan khusus (${pendekatanKhusus}) secara langsung ke dalam alur kegiatan pembelajaran.
3. Cantumkan identitas penyusun (${authorName} dari ${authorSchool}).
4. Gunakan istilah resmi Kemendikbudristek.

FORMAT RESPONS WAJIB JSON DENGAN STRUKTUR INI:
{
  "title": "Judul Resmi Dokumen Pembelajaran",
  "summary": "Ringkasan eksekutif dokumen dalam 2-3 kalimat formal",
  "tags": ["Kurikulum Merdeka", "${mataPelajaran}", "${jenjangKelas}"],
  "sections": [
    {
      "id": "sec_1",
      "title": "Judul Bagian",
      "content": "Isi uraian bagian lengkap",
      "type": "text"
    },
    {
      "id": "sec_2",
      "title": "Judul Bagian Tabel",
      "type": "table",
      "content": "Penjelasan singkat tabel",
      "tableData": {
        "headers": ["Kolom 1", "Kolom 2"],
        "rows": [["Nilai 1", "Nilai 2"]]
      }
    }
  ]
}`;

    const userPrompt = `Buatkan dokumen "${docType}" terlengkap untuk:
- Mapel: ${mataPelajaran}
- Kelas: ${jenjangKelas}
- Topik: ${topikMateri}
- Detail Materi: ${detailMateri}
- Model: ${modelPembelajaran}
- Pendekatan Khusus: ${pendekatanKhusus}
- Spesifikasi Tambahan: Jumlah soal (${jumlahSoal}), Level (${levelKesulitan}), Jenis Rubrik (${jenisRubrik}), Tema Kokulikuler (${temaP5}).

Kembalikan HANYA JSON sesuai format tanpa karakter markdown pembungkus tambahan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const responseText = response.text || '';
    let parsedData: any = {};

    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini JSON output:', e);
      return createFallbackDocument(formData);
    }

    return {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      docType,
      curriculum,
      mataPelajaran,
      jenjangKelas,
      topikMateri,
      orientasiHalaman,
      tampilkanPengesahan,
      title: parsedData.title || `Dokumen ${docType.toUpperCase()} - ${mataPelajaran}`,
      summary: parsedData.summary || `Dokumen ${docType} Kurikulum Merdeka resmi.`,
      tags: parsedData.tags || ['Kurikulum Merdeka', mataPelajaran, jenjangKelas],
      authorName: authorName || 'Guru Mata Pelajaran',
      authorSchool: authorSchool || 'Satuan Pendidikan',
      authorNip,
      kepalaSekolah,
      nipKepala,
      createdAt: new Date().toISOString(),
      sections: parsedData.sections && parsedData.sections.length > 0
        ? parsedData.sections
        : createFallbackSections(formData),
    };
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return createFallbackDocument(formData);
  }
};

export const regenerateSectionWithAI = async (
  sectionTitle: string,
  currentContent: string,
  instruction: string,
  docMetadata: { mataPelajaran?: string; topikMateri?: string }
): Promise<string> => {
  const ai = getGeminiClient();
  if (!ai) {
    return `${currentContent}\n\n[Catatan Penyesuaian AI]: ${instruction}`;
  }

  try {
    const prompt = `Anda adalah asisten kurikulum Indonesia.
Sempurnakan bagian dokumen "${sectionTitle}" untuk mata pelajaran "${docMetadata?.mataPelajaran || 'Umum'}" topik "${docMetadata?.topikMateri || 'Materi'}".

KONTEN SAAT INI:
${currentContent}

INSTRUKSI PERBAIKAN GURU:
"${instruction}"

Berikan hasil perbaikan konten secara lengkap, langsung dalam bentuk teks/markdown terstruktur yang siap dipakai.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    return response.text || currentContent;
  } catch (error) {
    console.error('Regenerate section error:', error);
    return `${currentContent}\n\n[Catatan Penyesuaian AI]: ${instruction}`;
  }
};

function createFallbackDocument(formData: DocFormData): GeneratedDocument {
  return {
    id: `doc_${Date.now()}`,
    docType: formData.docType || 'modul_ajar',
    curriculum: formData.curriculum || 'merdeka',
    mataPelajaran: formData.mataPelajaran || 'IPA Terpadu',
    jenjangKelas: formData.jenjangKelas || 'Fase B (Kelas 4 SD)',
    topikMateri: formData.topikMateri || 'Ekosistem & Rantai Makanan',
    orientasiHalaman: formData.orientasiHalaman || 'portrait',
    tampilkanPengesahan: formData.tampilkanPengesahan !== undefined ? formData.tampilkanPengesahan : true,
    title: `Modul Pembelajaran ${(formData.docType || 'MODUL').toUpperCase()} - ${formData.mataPelajaran || 'IPA'}`,
    summary: `Dokumen Kurikulum Merdeka resmi disusun untuk ${formData.mataPelajaran} kelas ${formData.jenjangKelas} dengan topik ${formData.topikMateri}.`,
    tags: ['Kurikulum Merdeka', formData.mataPelajaran || 'IPA', formData.jenjangKelas || 'Fase B'],
    authorName: formData.authorName || 'Ni Made Sri Wahyuni, S.Pd.',
    authorSchool: formData.authorSchool || 'SD Negeri 07 Pedungan',
    authorNip: formData.authorNip || '198504122010012015',
    kepalaSekolah: formData.kepalaSekolah || 'I Wayan Sutarja, M.Pd.',
    nipKepala: formData.nipKepala || '197803152005011008',
    createdAt: new Date().toISOString(),
    sections: createFallbackSections(formData),
  };
}

function createFallbackSections(formData: DocFormData): DocSection[] {
  const mapel = formData.mataPelajaran || 'Ilmu Pengetahuan Alam (IPA)';
  const topik = formData.topikMateri || 'Keseimbangan Ekosistem & Rantai Makanan';
  const model = formData.modelPembelajaran || 'Deep Learning (6E / Practical)';
  const pendekatan = formData.pendekatanKhusus || 'Integrasi Koding & Kecerdasan Artificial (KKA)';
  const jenjang = formData.jenjangKelas || 'Fase B (Kelas 4 SD)';

  return [
    {
      id: 'sec_1',
      title: 'I. INFORMASI UMUM & IDENTITAS MODUL',
      type: 'text',
      content: `### Identitas Dokumen Pembelajaran\n- **Satuan Pendidikan:** ${formData.authorSchool || 'SD Negeri 07 Pedungan'}\n- **Mata Pelajaran:** ${mapel}\n- **Fase / Kelas:** ${jenjang}\n- **Topik Pembelajaran:** ${topik}\n- **Pendekatan Khusus:** ${pendekatan}\n- **Alokasi Waktu:** ${formData.alokasiWaktu || '2 JP (70 Menit)'}\n- **Model Pembelajaran:** ${model}\n\n### Capaian Pembelajaran (CP)\nPeserta didik mampu menganalisis hubungan antar komponen ekosistem serta peran produsen, konsumen, dan pengurai dalam menjaga keseimbangan lingkungan sekitar secara kritis, kreatif, dan bertanggung jawab.`,
    },
    {
      id: 'sec_2',
      title: 'II. TUJUAN PEMBELAJARAN, PEMAHAMAN BERMAKNA & PROFIL LULUSAN',
      type: 'text',
      content: `### Tujuan Pembelajaran (TP)\n1. Peserta didik dapat mengidentifikasi komponen biotik dan abiotik dalam rantai makanan ekosistem lokal melalui pengamatan kartu interaktif secara cermat.\n2. Peserta didik dapat menganalisis dampak perubahan populasi salah satu organisme terhadap keseimbangan jejaring makanan secara kritis.\n3. Peserta didik mampu menyimulasikan aliran energi dalam rantai makanan menggunakan pendekatan ${pendekatan}.\n\n### Dimensi Profil Lulusan\n- **Penalaran Kritis:** Menganalisis sebab-akibat terganggunya rantai makanan.\n- **Kreativitas:** Merancang bagan jejaring makanan interaktif.\n- **Kolaborasi:** Berdiskusi secara proaktif dalam kelompok.\n- **Kemandirian:** Mengerjakan tugas eksplorasi mandiri.\n\n### Pemahaman Bermakna & Pertanyaan Pemantik\n- **Pemahaman Bermakna:** Keberlangsungan hidup setiap makhluk hidup saling bergantung.\n- **Pertanyaan Pemantik:** Apa yang terjadi pada rantai makanan sawah jika seluruh katak habis ditangkap manusia?`,
    },
    {
      id: 'sec_3',
      title: 'III. ALUR KEGIATAN PEMBELAJARAN',
      type: 'table',
      content: 'Langkah operasional pembelajaran mengintegrasikan model ' + model + ' dan pendekatan ' + pendekatan,
      tableData: {
        headers: ['Tahap Pembelajaran', 'Kegiatan Guru & Peserta Didik', 'Alokasi Waktu'],
        rows: [
          ['Kegiatan Pembuka', '1. Guru menyapa, memandu doa bersama, dan mengecek kesiapan belajar.\n2. Ice breaking untuk memfokuskan konsentrasi siswa.\n3. Apersepsi melalui pemutaran simulasi visual rantai makanan interaktif.\n4. Menyampaikan tujuan pembelajaran dan manfaatnya.', '10 Menit'],
          ['Kegiatan Inti (' + model + ')', '1. Stimulasi & Orientasi: Siswa mengamati kasus nyata di lingkungan sekitar.\n2. Eksplorasi Praktis: Siswa bekerja kelompok menyusun kartu komponen ekosistem.\n3. Diskusi & Olah Data: Kelompok memecahkan soal studi kasus pada LKPD.\n4. Verifikasi & Presentasi: Kelompok mempresentasikan bagan jejaring makanan.\n5. Penguatan: Guru memberikan umpan balik dan klarifikasi konseptual.', '50 Menit'],
          ['Kegiatan Penutup', '1. Siswa bersama guru menyimpulkan konsep utama pembelajaran.\n2. Refleksi perasaan dan pemahaman siswa terhadap materi.\n3. Pemberian tindak lanjut pengayaan serta doa penutup.', '10 Menit'],
        ],
      },
    },
    {
      id: 'sec_4',
      title: 'IV. ASESMEN PEMBELAJARAN & RUBRIK PENILAIAN',
      type: 'table',
      content: 'Instrumen asesmen diagnostik, formatif, dan sumatif',
      tableData: {
        headers: ['Jenis Asesmen', 'Teknik Penilaian', 'Instrumen / Alat Ukur'],
        rows: [
          ['Asesmen Diagnostik', 'Tanya Jawab & Emoticon Kesiapan', 'Lembar Pemetaan Kesiapan Belajar & Gaya Belajar Siswa'],
          ['Asesmen Formatif', 'Observasi & Kinerja Kelompok', 'Rubrik Diskusi & Presentasi Jejaring Makanan'],
          ['Asesmen Sumatif', 'Tes Tertulis HOTS', '5 Soal Pilihan Ganda & 2 Soal Esai Analitis'],
        ],
      },
    },
    {
      id: 'sec_5',
      title: 'V. PROGRAM REMEDIAL & PENGAYAAN',
      type: 'text',
      content: `### Program Remedial\nBimbingan perorangan atau tutor sebaya bagi siswa yang belum mencapai KKTP, dengan fokus pada pengulangan konsep dasar hubungan produsen dan konsumen melalui media visual sederhana.\n\n### Program Pengayaan\nPenugasan analisis dampak pencemaran limbah terhadap jejaring makanan di ekosistem perairan lokal bagi peserta didik yang telah melampaui kriteria.`,
    },
  ];
}
