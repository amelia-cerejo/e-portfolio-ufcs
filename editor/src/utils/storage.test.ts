import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultPortfolioData } from '../data/defaultData';
import { generateStandaloneHtml } from './generateStandaloneHtml';
import { createBlankTemplate, loadPortfolioData, normalizePortfolioData, resetToDefaultData, savePortfolioData } from './storage';

const saved = new Map<string, string>();
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => { saved.set(key, value); },
  },
});
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { location: { hash: '' } },
});

test('o exemplo inicial da ação 26109 mantém os seus dados', () => {
  const loaded = normalizePortfolioData(defaultPortfolioData);
  assert.equal(loaded.course.actionNumber, '26109');
  assert.equal(loaded.ufcds.length, 8);
  assert.deepEqual(loaded.ufcds.map((ufcd) => ufcd.code), defaultPortfolioData.ufcds.map((ufcd) => ufcd.code));
});

test('um projeto novo em branco começa sem dados de formação', () => {
  const blank = createBlankTemplate();
  assert.equal(blank.course.actionNumber, '');
  assert.equal(blank.course.actionTitle, '');
  assert.equal(blank.ufcds.length, 0);
  assert.equal(blank.sections?.find((section) => section.id === 'formacao')?.visible, false);
  assert.equal(blank.featuredProjects.length, 0);
  assert.equal(blank.skillEvolutions.length, 0);
  assert.deepEqual(loadPortfolioData(), blank);
  const publicHtml = generateStandaloneHtml(blank);
  assert.doesNotMatch(publicHtml, /26109|Jovem \+ Digital|Alverca do Ribatejo/);
});

test('ações e UFCD próprias sobrevivem à gravação e ao carregamento', () => {
  const blank = createBlankTemplate();
  const custom = {
    ...blank,
    course: { ...blank.course, actionNumber: '30001', actionTitle: 'Outra formação', duration: '50 horas' },
    ufcds: [
      { ...createBlankTemplate('training').ufcds[0], id: 'ufcd_a', code: '9001', name: 'Primeira', hours: 20 },
      { ...createBlankTemplate('training').ufcds[0], id: 'ufcd_b', code: '9002', name: 'Segunda', hours: 30 },
    ],
  };

  savePortfolioData(custom);
  const loaded = loadPortfolioData();
  assert.equal(loaded.course.actionNumber, '30001');
  assert.equal(loaded.course.actionTitle, 'Outra formação');
  assert.deepEqual(loaded.ufcds.map((ufcd) => [ufcd.code, ufcd.hours]), [['9001', 20], ['9002', 30]]);
  assert.equal(loaded.templateId, 'eportfolio_blank');
});

test('os modelos e a ordem das secções acompanham o projeto', () => {
  const professional = createBlankTemplate('professional');
  assert.equal(professional.ufcds.length, 0);
  assert.equal(professional.sections?.find((section) => section.id === 'formacao')?.visible, false);
  const sections = [...professional.sections!];
  const works = sections.findIndex((section) => section.id === 'trabalhos');
  sections.splice(works, 1);
  sections.splice(1, 0, { id: 'trabalhos', visible: true });
  savePortfolioData({ ...professional, sections });
  const loaded = loadPortfolioData();
  assert.equal(loaded.sections?.[1].id, 'trabalhos');
  const html = generateStandaloneHtml(loaded);
  assert.ok(html.indexOf('<h2>Trabalhos e projetos</h2>') < html.indexOf('<h2>Sobre mim</h2>'));
  assert.doesNotMatch(html, /<h2>A minha formação<\/h2>/);
});

test('o exemplo 26109 pode ser recuperado depois de um projeto em branco', () => {
  createBlankTemplate();
  const example = resetToDefaultData();
  assert.equal(example.course.actionNumber, '26109');
  assert.equal(loadPortfolioData().ufcds.length, 8);
  assert.equal(loadPortfolioData().templateId, defaultPortfolioData.templateId);
});
