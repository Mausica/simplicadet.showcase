import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'docs', 'Documentatie-tehnica-Simplicadet.docx');

const C = '333333';

function r(text, opts = {}) {
  return new TextRun({
    text,
    color: C,
    ...opts,
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
    children: [r(text, { bold: true, size: 28 })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [r(text, { bold: true, size: 24 })],
  });
}

function bodyLine(text) {
  return new Paragraph({
    spacing: { after: 140 },
    alignment: AlignmentType.JUSTIFIED,
    children: [r(text, { size: 22 })],
  });
}

function bullet(text) {
  return new Paragraph({
    spacing: { after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { left: 360, hanging: 260 },
    children: [r(`• ${text}`, { size: 22 })],
  });
}

function caption(text) {
  return new Paragraph({
    spacing: { before: 60, after: 180 },
    alignment: AlignmentType.CENTER,
    children: [r(text, { size: 20 })],
  });
}

async function pngDims(buffer) {
  if (buffer.length >= 24 && buffer[0] === 0x89 && buffer[1] === 0x50) {
    return { w: buffer.readUInt32BE(16), h: buffer.readUInt32BE(20) };
  }
  return { w: 400, h: 900 };
}

async function imageParagraphScaled(buffer) {
  const { w, h } = await pngDims(buffer);
  const maxW = 400;
  const scale = Math.min(1, maxW / w);
  const tw = Math.round(w * scale);
  const th = Math.round(h * scale);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 60 },
    children: [
      new ImageRun({
        type: 'png',
        data: buffer,
        transformation: { width: tw, height: th },
      }),
    ],
  });
}

const screenshots = [
  { file: '01-landing.png', caption: 'Fig. 1 — Pagina principală (landing, hartă instituții).' },
  { file: '02-prezenta-pluton.png', caption: 'Fig. 2 — Modul prezență (pluton, statusuri).' },
  { file: '03-resurse-meniu.png', caption: 'Fig. 3 — Resurse și calculator admitere.' },
];

async function build() {
  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [r('Documentație tehnică', { bold: true, size: 36 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [r('Simplicadet', { bold: true, size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [r('Versiune: 1.0 | Data: mai 2026 | Proiect: Simplicadet', { italics: true, size: 22 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [r('Raport tehnic de proiect pentru aplicația web Simplicadet', { size: 22 })],
    }),

    heading1('1. Rezumat'),
    bodyLine(
      'Aplicație web (React, TypeScript, Vite) pentru prezență, documente, servicii și resurse. Interfață tip liquid glass; acces din browser pe desktop și mobil.'
    ),
    bodyLine(
      'Simplicadet oferă un flux complet de management pentru unități educaționale și militare, incluzând administrare de elevi, prezență, documente oficiale și resurse digitale.'
    ),
    bodyLine(
      'Aplicația este proiectată pentru o utilizare prietenoasă, cu elemente vizuale consistente, navigare clară și suport pentru ecrane de dimensiuni variate.'
    ),

    heading1('2. Descriere proiect'),
    bodyLine(
      'Simplicadet este construit ca un instrument de management centralizat, cu module pentru prezență, servicii administrative, documente și resurse utile pentru cadre didactice și elevi.'
    ),
    bodyLine(
      'Proiectul prezintă o arhitectură modernă, cu separare clară între front-end, back-end și straturile de date, oferind astfel o bază solidă pentru extinderi viitoare.'
    ),

    heading1('3. Contribuții'),
    heading2('Radulescu Marius Gabriel'),
    bodyLine(
      'Backend: bază de date, API, logică de business și funcționalități esențiale (persistență, acces, fluxuri operaționale).'
    ),
    heading2('Tamas Sebastian Stefan'),
    bodyLine(
      'Frontend și UX: propuneri de interfață, sondaje privind culori și tema liquid glass, îmbunătățiri iterative ale aplicației.'
    ),

    heading1('4. Tehnologii și arhitectură'),
    bullet('Frontend: React, TypeScript, Vite, Tailwind, componente UI moderne și design responsive.'),
    bullet('Backend: Node.js, server central, API pentru autentificare, date și operațiuni specifice aplicației.'),
    bullet('Persistență date: suport local și pe server, integrare cu fluxuri de autentificare și date per utilizator.'),
    bodyLine(
      'Arhitectura separă clar prezentarea, logica aplicației și serviciile de date, ceea ce facilitează întreținerea, testarea și dezvoltarea ulterioară.'
    ),

    heading1('5. Notă și recomandări'),
    bodyLine(
      'Pentru instalare, configurare și cerințe exacte, consultați README din repository și documentația internă a proiectului.'
    ),
    bodyLine(
      'Proiectul este gândit să fie scalabil și ușor de extins cu noi module: rapoarte, audit, integrare GIS și fluxuri de documente.'
    ),
    bodyLine(
      'Acest raport tehnic oferă o privire de ansamblu clară asupra soluției, evidențiind designul, funcționalitatea și implementarea generală.'
    ),

    heading1('6. Capturi de ecran'),
    bodyLine('Ilustrări: landing, modul prezență, secțiunea Resurse.'),
  ];

  for (const shot of screenshots) {
    const fp = path.join(root, 'docs', 'screenshots', shot.file);
    if (!fs.existsSync(fp)) {
      console.warn('Lipsește fișierul:', fp);
      continue;
    }
    const buf = fs.readFileSync(fp);
    children.push(await imageParagraphScaled(buf));
    children.push(caption(shot.caption));
  }

  children.push(
    heading1('5. Notă'),
    bodyLine('Pentru instalare și cerințe: README din repository.')
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  try {
    fs.writeFileSync(outPath, buffer);
    console.log('Generat:', outPath);
  } catch (e) {
    if (e && e.code === 'EBUSY') {
      const alt = path.join(path.dirname(outPath), 'Documentatie-tehnica-Simplicadet-nou.docx');
      fs.writeFileSync(alt, buffer);
      console.log('Fișierul principal era deschis în Word. S-a salvat copie:', alt);
    } else {
      throw e;
    }
  }
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
