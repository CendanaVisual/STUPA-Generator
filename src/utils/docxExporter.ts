import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  AlignmentType,
  WidthType,
  Header,
  Footer,
  PageNumber,
  ShadingType,
  PageOrientation,
} from 'docx';
import { saveAs } from 'file-saver';
import { GeneratedDocument } from '../types';

export const exportDocumentToDocx = async (docData: GeneratedDocument) => {
  const docxParagraphs: (Paragraph | Table)[] = [];

  // Title Block
  docxParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: docData.title.toUpperCase(),
          bold: true,
          size: 28, // 14pt
          font: 'Arial',
          color: '1E3A8A', // Deep Navy
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `${docData.curriculum === 'kbc_kemenag' ? 'KURIKULUM BERBASIS CINTA (KBC KEMENAG)' : 'KURIKULUM MERDEKA'} — ${docData.authorSchool.toUpperCase()}`,
          bold: true,
          size: 20,
          font: 'Arial',
          color: '475569',
        }),
      ],
    })
  );

  // Identitas Table
  const identitasRows = [
    ['Satuan Pendidikan', docData.authorSchool || 'SD Negeri 07 Pedungan'],
    ['Mata Pelajaran', docData.mataPelajaran],
    ['Kelas / Fase', docData.jenjangKelas],
    ['Topik / Materi Pokok', docData.topikMateri],
    ['Penyusun / Guru', docData.authorName || 'Guru Mata Pelajaran'],
    ['Tanggal Penyusunan', new Date(docData.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })],
  ];

  const identitasTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: identitasRows.map(
      ([label, val]) =>
        new TableRow({
          children: [
            new TableCell({
              width: { size: 30, type: WidthType.PERCENTAGE },
              shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: label, bold: true, size: 18, font: 'Arial' })],
                }),
              ],
            }),
            new TableCell({
              width: { size: 70, type: WidthType.PERCENTAGE },
              children: [
                new Paragraph({
                  children: [new TextRun({ text: val, size: 18, font: 'Arial' })],
                }),
              ],
            }),
          ],
        })
    ),
  });

  docxParagraphs.push(identitasTable);
  docxParagraphs.push(new Paragraph({ spacing: { after: 300 } }));

  // Process Sections
  docData.sections.forEach((sec, idx) => {
    // Section Heading
    docxParagraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: `${idx + 1}. ${sec.title}`,
            bold: true,
            size: 22, // 11pt
            font: 'Arial',
            color: '1E3A8A',
          }),
        ],
      })
    );

    // If section has tableData
    if (sec.type === 'table' && sec.tableData && sec.tableData.headers.length > 0) {
      const headerRow = new TableRow({
        tableHeader: true,
        children: sec.tableData.headers.map(
          (h) =>
            new TableCell({
              shading: { fill: '1E3A8A', type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [new TextRun({ text: h, bold: true, size: 18, color: 'FFFFFF', font: 'Arial' })],
                }),
              ],
            })
        ),
      });

      const dataRows = sec.tableData.rows.map(
        (row, rIdx) =>
          new TableRow({
            children: row.map(
              (cell) =>
                new TableCell({
                  shading: rIdx % 2 === 1 ? { fill: 'F8FAFC', type: ShadingType.CLEAR } : undefined,
                  children: [
                    new Paragraph({
                      children: [new TextRun({ text: cell, size: 18, font: 'Arial' })],
                    }),
                  ],
                })
            ),
          })
      );

      docxParagraphs.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [headerRow, ...dataRows],
        })
      );
      docxParagraphs.push(new Paragraph({ spacing: { after: 180 } }));
    } else {
      // Parse content paragraphs/lists
      const lines = (sec.content || '').split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
          docxParagraphs.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 60 },
              children: [new TextRun({ text: trimmed.replace(/^[-*•]\s*/, ''), size: 20, font: 'Arial' })],
            })
          );
        } else if (/^\d+\.\s/.test(trimmed)) {
          docxParagraphs.push(
            new Paragraph({
              spacing: { after: 60 },
              children: [new TextRun({ text: trimmed, size: 20, font: 'Arial' })],
            })
          );
        } else if (trimmed.startsWith('### ') || trimmed.startsWith('## ')) {
          docxParagraphs.push(
            new Paragraph({
              spacing: { before: 140, after: 80 },
              children: [
                new TextRun({
                  text: trimmed.replace(/^#+\s*/, ''),
                  bold: true,
                  size: 20,
                  font: 'Arial',
                  color: '0F172A',
                }),
              ],
            })
          );
        } else {
          docxParagraphs.push(
            new Paragraph({
              spacing: { after: 100 },
              children: [new TextRun({ text: trimmed, size: 20, font: 'Arial' })],
            })
          );
        }
      });
    }
  });

  // Signature Block (if enabled)
  if (docData.tampilkanPengesahan !== false) {
    const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const kepalaSekolah = docData.kepalaSekolah || 'Kepala Sekolah';
    const nipKepala = docData.nipKepala ? `NIP. ${docData.nipKepala}` : 'NIP. -';
    const guruNama = docData.authorName || 'Guru Mata Pelajaran';
    const nipGuru = docData.authorNip ? `NIP. ${docData.authorNip}` : 'NIP. -';

    docxParagraphs.push(
      new Paragraph({ spacing: { before: 400 } }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
          insideVertical: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', size: 18, font: 'Arial' })] }),
                  new Paragraph({ children: [new TextRun({ text: `Kepala ${docData.authorSchool}`, bold: true, size: 18, font: 'Arial' })] }),
                  new Paragraph({ spacing: { before: 800 }, children: [new TextRun({ text: kepalaSekolah, bold: true, underline: {}, size: 18, font: 'Arial' })] }),
                  new Paragraph({ children: [new TextRun({ text: nipKepala, size: 16, font: 'Arial', color: '64748B' })] }),
                ],
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: `..., ${todayStr}`, size: 18, font: 'Arial' })] }),
                  new Paragraph({ children: [new TextRun({ text: 'Guru Mata Pelajaran,', bold: true, size: 18, font: 'Arial' })] }),
                  new Paragraph({ spacing: { before: 800 }, children: [new TextRun({ text: guruNama, bold: true, underline: {}, size: 18, font: 'Arial' })] }),
                  new Paragraph({ children: [new TextRun({ text: nipGuru, size: 16, font: 'Arial', color: '64748B' })] }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }

  // Determine Orientation
  const isLandscape = docData.orientasiHalaman === 'landscape';

  // Build Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              orientation: isLandscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'STUPA GENERATOR • Dokumen Resmi Administrasi Kurikulum Merdeka',
                    size: 14,
                    color: '94A3B8',
                    font: 'Arial',
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Halaman ', size: 16, color: '64748B', font: 'Arial' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '64748B', font: 'Arial' }),
                  new TextRun({ text: ' dari ', size: 16, color: '64748B', font: 'Arial' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '64748B', font: 'Arial' }),
                ],
              }),
            ],
          }),
        },
        children: docxParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const cleanFilename = `${docData.docType.toUpperCase()}_${docData.mataPelajaran}_${docData.topikMateri}`
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 50);
  saveAs(blob, `${cleanFilename}.docx`);
};
