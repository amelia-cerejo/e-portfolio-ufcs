import type { PortfolioData } from '../types';
import { generatePdfHtml, normalizePdfOptions } from './pdf';

export function hasCurrentPublishedPdf(data: PortfolioData): boolean {
  return Boolean(data.publishedPdf
    && /^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/.test(data.publishedPdf.dataUrl)
    && data.publishedPdf.sourceHtml === generatePdfHtml(data, normalizePdfOptions(data)));
}

export function addPdfDownload(html: string, data: PortfolioData): string {
  if (!hasCurrentPublishedPdf(data)) return html;
  return html.replace(/<main\b[^>]*>/, '$&<p class="no-print"><a href="portfolio.pdf" download="portfolio.pdf" style="display:inline-block;padding:10px 16px;border-radius:6px;background:#5132a7;color:white;text-decoration:none;font-weight:600">Descarregar PDF</a></p>');
}
