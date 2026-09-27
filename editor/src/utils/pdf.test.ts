import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultPortfolioData } from '../data/defaultData';
import { generatePdfHtml, normalizePdfOptions } from './pdf';

test('o PDF começa com as secções visíveis e não altera o projeto', () => {
  const data = structuredClone(defaultPortfolioData);
  data.sections = [{ id: 'capa', visible: true }, { id: 'sobre', visible: true }, { id: 'formacao', visible: false }];
  const original = JSON.stringify(data);
  const options = normalizePdfOptions(data);
  assert.equal(options.sections.includes('formacao'), false);
  generatePdfHtml(data, options);
  assert.equal(JSON.stringify(data), original);
});

test('o PDF permite excluir a capa, projetos e UFCD específicos', () => {
  const options = { ...normalizePdfOptions(defaultPortfolioData), sections: ['ufcds', 'trabalhos'] as const, ufcdIds: [defaultPortfolioData.ufcds[0].id], projectIds: [] };
  const html = generatePdfHtml(defaultPortfolioData, { ...options, sections: [...options.sections] });
  assert.doesNotMatch(html, /data-section="capa"/);
  assert.match(html, new RegExp(defaultPortfolioData.ufcds[0].name));
  assert.doesNotMatch(html, /<h2>UFCD 0753/);
  assert.doesNotMatch(html, new RegExp(defaultPortfolioData.featuredProjects[0].title));
});

test('as opções de impressão aplicam A4, letra, margens e quebras', () => {
  const html = generatePdfHtml(defaultPortfolioData, { ...normalizePdfOptions(defaultPortfolioData), orientation: 'landscape', fontSize: 14, margin: 20, pageBreaks: ['sobre'], eachUfcdNewPage: true });
  assert.match(html, /size: A4 landscape; margin: 20mm/);
  assert.match(html, /font-size: 14pt/);
  assert.match(html, /\[data-section="sobre"\] \{ break-before: page/);
  assert.match(html, /section \+ section \{ break-before: page/);
});

test('reflexões e imagens podem ser omitidas sem criar uma secção vazia', () => {
  const html = generatePdfHtml(defaultPortfolioData, { ...normalizePdfOptions(defaultPortfolioData), includeReflections: false, includeImages: false });
  assert.doesNotMatch(html, /<img /);
  assert.doesNotMatch(html, /<div class="portfolio-section" data-section="reflexao-final"/);
  assert.doesNotMatch(html, /<h3>Reflexão<\/h3>/);
});
