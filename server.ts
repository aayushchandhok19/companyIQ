import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { verifiedCompanies, getCompanyById, searchCompanies } from './src/data/companyRegistry';
import { generateAIAnalysis } from './server/geminiService';
import { fetchLiveSecCompanyFacts, getSecCompanyTickers } from './server/secEdgar';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Routes
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'CompanyIQ Corporate Financial Intelligence Engine',
      timestamp: new Date().toISOString()
    });
  });

  // Search companies endpoint
  app.get('/api/companies/search', (req: Request, res: Response) => {
    const query = (req.query.q as string) || '';
    const results = searchCompanies(query);
    res.json({ query, results });
  });

  // Get specific company full profile
  app.get('/api/companies/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const company = getCompanyById(id);
    if (!company) {
      res.status(404).json({ error: `Company with ID or Ticker '${id}' not found in registry.` });
      return;
    }
    res.json(company);
  });

  // AI Analysis endpoint
  app.post('/api/ai-analysis', async (req: Request, res: Response) => {
    try {
      const { profile } = req.body;
      if (!profile || !profile.historicalYears || profile.historicalYears.length === 0) {
        res.status(400).json({ error: 'Valid company profile with financial years is required.' });
        return;
      }
      const report = await generateAIAnalysis(profile);
      res.json(report);
    } catch (err: any) {
      console.error('AI Analysis generation failed:', err);
      res.status(500).json({ error: err.message || 'Failed to generate financial analysis' });
    }
  });

  // SEC EDGAR proxy endpoints
  app.get('/api/sec/tickers', async (req: Request, res: Response) => {
    try {
      const tickers = await getSecCompanyTickers();
      res.json(tickers);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/sec/facts/:cik', async (req: Request, res: Response) => {
    try {
      const cik = req.params.cik;
      const facts = await fetchLiveSecCompanyFacts(cik);
      if (!facts) {
        res.status(404).json({ error: `Could not retrieve live SEC facts for CIK ${cik}` });
        return;
      }
      res.json(facts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Document upload / extraction endpoint
  app.post('/api/document/extract', (req: Request, res: Response) => {
    try {
      const { fileName, fileContent, fileType } = req.body;
      if (!fileContent) {
        res.status(400).json({ error: 'File content is required' });
        return;
      }

      // Parse structured CSV or JSON content
      let extractedData: any = null;
      if (fileName?.endsWith('.json') || fileType === 'json') {
        extractedData = JSON.parse(fileContent);
      } else {
        // Simple CSV parser for financial statements
        const lines = fileContent.split(/\r?\n/).filter((l: string) => l.trim().length > 0);
        const headers = lines[0].split(',').map((h: string) => h.trim().replace(/^"|"$/g, ''));
        const rows = lines.slice(1).map((line: string) => {
          const cells = line.split(',').map((c: string) => c.trim().replace(/^"|"$/g, ''));
          const rowObj: Record<string, string> = {};
          headers.forEach((h: string, i: number) => {
            rowObj[h] = cells[i] || '';
          });
          return rowObj;
        });
        extractedData = { headers, rows, totalRows: rows.length };
      }

      res.json({
        success: true,
        fileName,
        extractionTimestamp: new Date().toISOString(),
        validationStatus: 'Extracted with Validation (Review Recommended)',
        extractedData
      });
    } catch (err: any) {
      res.status(400).json({ error: `Extraction error: ${err.message}` });
    }
  });

  // Vite Integration in Development
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CompanyIQ Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CompanyIQ server:', err);
  process.exit(1);
});
