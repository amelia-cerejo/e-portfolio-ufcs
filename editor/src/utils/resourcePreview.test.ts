import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { defaultPortfolioData } from '../data/defaultData';
import { generateConfigurableHtml } from './generateConfigurableHtml';
import { isPreviewableImage, isSafeResource } from '../components/ResourcePreviewModal';

test('o visualizador distingue imagens diretas de páginas de partilha', () => {
  assert.equal(isPreviewableImage('https://site.pt/imagem.png?size=large'), true);
  assert.equal(isPreviewableImage('https://drive.google.com/file/d/abc/view'), false);
  assert.equal(isSafeResource('javascript:alert(1)'), false);
});

test('o site exportado abre trabalhos e evidências em modal com alternativa externa', () => {
  const data = structuredClone(defaultPortfolioData);
  data.featuredProjects[0].linkUrl = 'https://exemplo.pt/projeto';
  data.ufcds[0].evidences = [{ id: 'e1', ufcdId: data.ufcds[0].id, title: 'Captura', type: 'image', url: 'https://drive.google.com/file/d/abc/view', description: '', date: '', isGroupWork: false }];
  const html = generateConfigurableHtml(data, {});
  assert.match(html, /data-resource-url="https:\/\/exemplo.pt\/projeto"/);
  assert.match(html, /data-resource-url="https:\/\/drive.google.com\/file\/d\/abc\/view"/);
  assert.match(html, /id="resource-dialog"/);
  assert.match(html, /Abrir numa nova aba/);
  assert.doesNotMatch(html, /<img[^>]*src="https:\/\/drive.google.com\/file\/d\/abc\/view"/);
  const script = html.split('<script>')[1]?.split('</script>')[0];
  assert.ok(script);
  assert.doesNotThrow(() => new vm.Script(script));
});
