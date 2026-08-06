import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory document storage for sharing links
const sharedDocumentsStore: Record<string, any> = {};

// Gemini Client initialization
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('Warning: GEMINI_API_KEY is not set. Using fallback generation logic.');
  }
  return new GoogleGenAI({
    apiKey: apiKey || 'dummy-key',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'STUPA GENERATOR', version: '3.0.0' });
});

// API: Generate Document with Gemini
app.post('/api/generate-document', async (req, res) => {
  try {
    const formData = req.body;
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback response if API key is not configured
      const fallbackDoc = createFallbackDocument(formData);
      return res.json(fallbackDoc);
    }

    const ai = getGeminiClient();

    // System prompt according to Kurikulum Merdeka / KBC Kemenag
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
4. Gunakan istilah resmi Kemendikbudristek: Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), Pemahaman Bermakna, Pertanyaan Pemantik, Asesmen Diagnostik, Formatif, Sumatif, KKTP, Remedial & Pengayaan.

FORMAT RESPONS WAJIB JSON DENGAN STRUKTUR INI:
{
  "title": "Judul Resmi Dokumen Pembelajaran",
  "summary": "Ringkasan eksekutif dokumen dalam 2-3 kalimat formal",
  "tags": ["Kurikulum Merdeka", "${mataPelajaran}", "${jenjangKelas}"],
  "sections": [
    {
      "id": "sec_1",
      "title": "Judul Bagian (Contoh: I. INFORMASI UMUM & IDENTITAS MODUL)",
      "content": "Isi uraian bagian lengkap dalam bentuk poin-poin markdown terstruktur",
      "type": "text"
    },
    {
      "id": "sec_2",
      "title": "Judul Bagian Berbentuk Tabel (Contoh: III. ALUR KEGIATAN PEMBELAJARAN / KISI-KISI / RUBRIK)",
      "type": "table",
      "content": "Penjelasan singkat tabel",
      "tableData": {
        "headers": ["Kolom 1", "Kolom 2", "Kolom 3"],
        "rows": [
          ["Nilai 1", "Nilai 2", "Nilai 3"]
        ]
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

Susun komponen bagian dokumen secara sistematis:
- Jika Modul Ajar: Identitas, Capaian Pembelajaran, Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Langkah Kegiatan Pembuka (15%), Kegiatan Inti dengan alur ${modelPembelajaran} & ${pendekatanKhusus} (70%), Kegiatan Penutup (15%), Asesmen Diagnostik/Formatif/Sumatif, Lampiran LKPD & Rubrik.
- Jika LKPD: Judul Kegiatan, Petunjuk Kerja, Ringkasan Materi Pendukung, Langkah Eksplorasi/Praktik Siswa, Pertanyaan Diskusi Analitis, Ruang Refleksi.
- Jika Soal HOTS: Tabel Kisi-Kisi Soal (CP, Indikator, Level Bloom, No Soal), Naskah Soal lengkap dengan Kunci Jawaban & Pembahasan Konseptual.
- Jika Rubrik Penilaian: Kriteria Penilaian, Skala Skor (1-4) beserta deskriptor kualitatif yang jelas.
- Jika ATP/Prota/Prosem: Pemetaan Alur Tujuan Pembelajaran, Alokasi JP per Bab, Distribusi Jam Semester 1 & 2.
- Jika Modul Kokulikuler: Dimensi Profil Lulusan, Elemen, Subelemen, Alur Aksi Kokulikuler (Pengenalan, Kontekstualisasi, Aksi, Refleksi, Tindak Lanjut), Lembar Evaluasi.
- Jika Asesmen Diagnostik: Instrumen Non-Kognitif (Gaya Belajar & Kesiapan Emosi) & Kognitif (Pemetaan Pengetahuan Awal Bab).
- Jika Jurnal Harian: Refleksi Mengajar Model 4P (Peristiwa, Perasaan, Pembelajaran, Perubahan) & Catatan Kejadian Penting Kelas.

Kembalikan HANYA JSON sesuai format tanpa karakter markdown pembungkus tambahan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
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
      parsedData = createFallbackDocument(formData);
    }

    const docResult = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      docType,
      curriculum,
      mataPelajaran,
      jenjangKelas,
      topikMateri,
      orientasiHalaman,
      tampilkanPengesahan,
      title: parsedData.title || `Dokumen ${docType.toUpperCase()} - ${mataPelajaran}`,
      summary: parsedData.summary || `Dokumen ${docType} Kurikulum Merdeka resmi disusun untuk ${mataPelajaran} ${jenjangKelas}.`,
      tags: parsedData.tags || ['Kurikulum Merdeka', mataPelajaran, jenjangKelas],
      authorName,
      authorSchool,
      authorNip,
      kepalaSekolah,
      nipKepala,
      createdAt: new Date().toISOString(),
      sections: parsedData.sections && parsedData.sections.length > 0
        ? parsedData.sections
        : createFallbackSections(formData),
    };

    return res.json(docResult);
  } catch (error: any) {
    console.error('Error generating document:', error);
    const fallbackDoc = createFallbackDocument(req.body);
    return res.json(fallbackDoc);
  }
});

// API: Regenerate specific section with AI
app.post('/api/regenerate-section', async (req, res) => {
  try {
    const { sectionTitle, currentContent, promptInstruction, docMetadata } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        content: `${currentContent}\n\n[Catatan Penyesuaian AI]: ${promptInstruction}`,
      });
    }

    const ai = getGeminiClient();
    const prompt = `Anda adalah asisten kurikulum Indonesia.
Sempurnakan atau perbaiki bagian dokumen "${sectionTitle}" untuk mata pelajaran "${docMetadata?.mataPelajaran || 'Umum'}" topik "${docMetadata?.topikMateri || 'Materi'}".

KONTEN SAAT INI:
${currentContent}

INSTRUKSI PERBAIKAN GURU:
"${promptInstruction}"

Berikan hasil perbaikan konten secara lengkap, langsung dalam bentuk teks/markdown terstruktur yang siap dipakai. Jangan berikan kata sambutan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return res.json({ content: response.text || currentContent });
  } catch (err: any) {
    console.error('Regenerate section error:', err);
    return res.status(500).json({ error: 'Gagal memperbarui bagian dokumen dengan AI.' });
  }
});

// API: Share document
app.post('/api/share-document', (req, res) => {
  const { doc } = req.body;
  if (!doc) {
    return res.status(400).json({ error: 'Data dokumen tidak valid.' });
  }
  const shareId = `sh_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  sharedDocumentsStore[shareId] = doc;
  res.json({ id: shareId, shareUrl: `/shared/${shareId}` });
});

// API: Get shared document
app.get('/api/shared-document/:id', (req, res) => {
  const shareId = req.params.id;
  const doc = sharedDocumentsStore[shareId];
  if (!doc) {
    return res.status(404).json({ error: 'Dokumen berbagi tidak ditemukan atau telah kedaluwarsa.' });
  }
  res.json({ doc });
});

// Fallback document creator for robust offline / error handling
function createFallbackDocument(formData: any) {
  return {
    id: `doc_${Date.now()}`,
    docType: formData.docType || 'modul_ajar',
    curriculum: formData.curriculum || 'merdeka',
    mataPelajaran: formData.mataPelajaran || 'IPA Terpadu',
    jenjangKelas: formData.jenjangKelas || 'Fase B (Kelas 4 SD)',
    topikMateri: formData.topikMateri || 'Ekosistem & Rantai Makanan',
    orientasiHalaman: formData.orientasiHalaman || 'portrait',
    tampilkanPengesahan: formData.tampilkanPengesahan !== undefined ? formData.tampilkanPengesahan : true,
    title: `Modul Pembelajaran ${formData.docType?.toUpperCase() || 'MODUL'} - ${formData.mataPelajaran || 'IPA'}`,
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

function createFallbackSections(formData: any) {
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
      content: `### Identitas Dokumen Pembelajaran
- **Satuan Pendidikan:** ${formData.authorSchool || 'SD Negeri 07 Pedungan'}
- **Mata Pelajaran:** ${mapel}
- **Fase / Kelas:** ${jenjang}
- **Topik Pembelajaran:** ${topik}
- **Pendekatan Khusus:** ${pendekatan}
- **Alokasi Waktu:** ${formData.alokasiWaktu || '2 JP (70 Menit)'}
- **Model Pembelajaran:** ${model}

### Capaian Pembelajaran (CP)
Peserta didik mampu menganalisis hubungan antar komponen ekosistem serta peran produsen, konsumen, dan pengurai dalam menjaga keseimbangan lingkungan sekitar secara kritis, kreatif, dan bertanggung jawab.`,
    },
    {
      id: 'sec_2',
      title: 'II. TUJUAN PEMBELAJARAN, PEMAHAMAN BERMAKNA & PROFIL LULUSAN',
      type: 'text',
      content: `### Tujuan Pembelajaran (TP)
1. Peserta didik dapat mengidentifikasi komponen biotik dan abiotik dalam rantai makanan ekosistem lokal melalui pengamatan kartu interaktif secara cermat.
2. Peserta didik dapat menganalisis dampak perubahan populasi salah satu organisme terhadap keseimbangan jejaring makanan secara kritis.
3. Peserta didik mampu menyimulasikan aliran energi dalam rantai makanan menggunakan pendekatan ${pendekatan}.

### Dimensi Profil Lulusan
- **Penalaran Kritis:** Menganalisis sebab-akibat terganggunya rantai makanan.
- **Kreativitas:** Merancang bagan jejaring makanan interaktif.
- **Kolaborasi:** Berdiskusi secara proaktif dalam kelompok.
- **Kemandirian:** Mengerjakan tugas eksplorasi mandiri.

### Pemahaman Bermakna & Pertanyaan Pemantik
- **Pemahaman Bermakna:** Keberlangsungan hidup setiap makhluk hidup saling bergantung. Menjaga kelestarian satu spesies menentukan masa depan seluruh ekosistem.
- **Pertanyaan Pemantik:** Apa yang terjadi pada rantai makanan sawah jika seluruh katak habis ditangkap manusia?`,
    },
    {
      id: 'sec_3',
      title: 'III. ALUR KEGIATAN PEMBELAJARAN',
      type: 'table',
      content: 'Langkah operasional pembelajaran mengintegrasikan model ' + model + ' dan pendekatan ' + pendekatan,
      tableData: {
        headers: ['Tahap Pembelajaran', 'Kegiatan Guru & Peserta Didik', 'Alokasi Waktu'],
        rows: [
          [
            'Kegiatan Pembuka',
            '1. Guru menyapa, memandu doa bersama, dan mengecek kesiapan belajar.\n2. Ice breaking "Suara Alam" untuk memfokuskan konsentrasi siswa.\n3. Apersepsi melalui pemutaran simulasi visual rantai makanan interaktif.\n4. Menyampaikan tujuan pembelajaran dan manfaatnya.',
            '10 Menit',
          ],
          [
            'Kegiatan Inti (' + model + ')',
            '1. **Stimulasi & Orientasi:** Siswa mengamati kasus nyata kepunahan konsumen di lingkungan sekitar.\n2. **Eksplorasi Praktis:** Siswa bekerja kelompok menyusun kartu komponen ekosistem menggunakan alur logika ' + pendekatan + '.\n3. **Diskusi & Olah Data:** Kelompok memecahkan soal studi kasus pada LKPD interaktif.\n4. **Verifikasi & Presentasi:** Kelompok mempresentasikan bagan jejaring makanan di depan kelas.\n5. **Penguatan:** Guru memberikan umpan balik dan klarifikasi konseptual.',
            '50 Menit',
          ],
          [
            'Kegiatan Penutup',
            '1. Siswa bersama guru menyimpulkan konsep utama pembelajaran.\n2. Refleksi perasaan dan pemahaman siswa terhadap materi.\n3. Pemberian tindak lanjut pengayaan serta doa penutup.',
            '10 Menit',
          ],
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
      content: `### Program Remedial
Bimbingan perorangan atau tutor sebaya bagi siswa yang belum mencapai KKTP, dengan fokus pada pengulangan konsep dasar hubungan produsen dan konsumen melalui media visual sederhanan.

### Program Pengayaan
Penugasan analisis dampak pencemaran limbah terhadap jejaring makanan di ekosistem perairan lokal bagi peserta didik yang telah melampaui kriteria.`,
    },
  ];
}

// Start Server & Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[STUPA GENERATOR] Server running on http://localhost:${PORT}`);
  });
}

startServer();
