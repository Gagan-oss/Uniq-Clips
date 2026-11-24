import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateEnquiry, validateMeetingRequest } from './src/utils/validation.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

interface StoredSubmission {
  id: string;
  type: 'meeting-request' | 'enquiry';
  createdAt: string;
  payload: Record<string, unknown>;
}

const submissions: StoredSubmission[] = [];

function recordSubmission(entry: StoredSubmission) {
  submissions.push(entry);
  try {
    const dir = path.join(__dirname, '.data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.appendFileSync(path.join(dir, 'submissions.jsonl'), `${JSON.stringify(entry)}\n`);
  } catch {
    // Ephemeral environments may be read-only; in-memory store still holds the entry.
  }
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '64kb' }));
  app.use(express.urlencoded({ extended: false, limit: '64kb' }));

  // Allow embedding inside Whop and AI Studio iframes without frame-ancestors blocks
  app.use((_req, res, next) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', 'frame-ancestors *');
    next();
  });

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/meeting-request', (req, res) => {
    const result = validateMeetingRequest(req.body ?? {});
    if (!result.ok || !result.data) {
      res.status(400).json({ ok: false, error: result.error });
      return;
    }
    const id = `mtg_${Date.now().toString(36)}`;
    recordSubmission({
      id,
      type: 'meeting-request',
      createdAt: new Date().toISOString(),
      payload: { ...result.data },
    });
    res.status(200).json({ ok: true, id });
  });

  app.post('/api/enquiry', (req, res) => {
    const result = validateEnquiry(req.body ?? {});
    if (!result.ok || !result.data) {
      res.status(400).json({ ok: false, error: result.error });
      return;
    }
    const id = `enq_${Date.now().toString(36)}`;
    recordSubmission({
      id,
      type: 'enquiry',
      createdAt: new Date().toISOString(),
      payload: { ...result.data },
    });
    res.status(200).json({ ok: true, id });
  });

  if (IS_PROD) {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNIQ CLIPS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
