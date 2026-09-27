import test from 'node:test';
import assert from 'node:assert/strict';
import { createBlankTemplate, normalizePortfolioData } from './storage';
import { generatePdfHtml, normalizePdfOptions } from './pdf';
import { createPortfolioZip } from './exportZip';

Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { setItem: () => {} } });

test('o ZIP inclui o PDF escolhido e apenas um botão de descarga', async () => {
  const data = createBlankTemplate();
  data.publishedPdf = { name: 'escolhido.pdf', dataUrl: 'data:application/pdf;base64,JVBERi0xLjQ=', sourceHtml: generatePdfHtml(data, normalizePdfOptions(data)) };
  const restored = normalizePortfolioData(JSON.parse(JSON.stringify(data)));
  assert.deepEqual(restored.publishedPdf, data.publishedPdf);
  const zip = createPortfolioZip(restored);
  assert.equal(await zip.file('portfolio.pdf')!.async('string'), '%PDF-1.4');
  const html = await zip.file('index.html')!.async('string');
  assert.match(html, /href="portfolio.pdf" download="portfolio.pdf"/);
  assert.doesNotMatch(html, /sourceHtml|data:application\/pdf|Preparar PDF/);
  assert.equal(zip.file('dados-eportefolio.json'), null);
});

test('sem PDF ou com conteúdo alterado não há ligação quebrada nem PDF antigo', async () => {
  const data = createBlankTemplate();
  assert.equal(createPortfolioZip(data).file('portfolio.pdf'), null);
  data.publishedPdf = { name: 'antigo.pdf', dataUrl: 'data:application/pdf;base64,JVBERi0xLjQ=', sourceHtml: generatePdfHtml(data, normalizePdfOptions(data)) };
  data.profile.studentName = 'Nome atualizado';
  const zip = createPortfolioZip(data);
  assert.equal(zip.file('portfolio.pdf'), null);
  assert.doesNotMatch(await zip.file('index.html')!.async('string'), /Descarregar PDF/);
});
