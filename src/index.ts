import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

import { corridaQueue } from './queue.js';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

// Middleware de autenticação básica para desenvolvimento
const basicAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  const base64Credentials = auth.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  // Credenciais padrão para desenvolvimento
  const validUsername = process.env.BULL_BOARD_USER || 'admin';
  const validPassword = process.env.BULL_BOARD_PASS || 'admin123';

  if (username === validUsername && password === validPassword) {
    return next();
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
};

const app = express();
app.use(bodyParser.json());

const port = Number(process.env.PORT || 3000);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/finalizar-corrida', async (req, res) => {
  try {
    const { corridaId, motoristaId } = req.body as { corridaId?: string; motoristaId?: string };
    if (!corridaId || !motoristaId) return res.status(400).json({ error: 'corridaId e motoristaId são obrigatórios' });

    const jobId = `finalizar-${corridaId}`;

    await corridaQueue.add(
      'processarFinalizacao',
      { corridaId, motoristaId },
      {
        jobId,
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: 3600 * 24 },
        removeOnFail: { age: 3600 * 24 }
      }
    );

    return res.json({ status: 'enqueued', corridaId, jobId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'erro interno' });
  }
});

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');
createBullBoard({
  queues: [new BullMQAdapter(corridaQueue)],
  serverAdapter,options:{
    // uiBasePath:'/admin/queues'
  }
});

// Aplica autenticação apenas em desenvolvimento
if (process.env.NODE_ENV === 'dev') {
  console.log('🔒 Bull Board protegido com autenticação básica');
  console.log('📋 Credenciais: admin / admin123 (ou configure BULL_BOARD_USER e BULL_BOARD_PASS)');
  app.use('/admin/queues', basicAuthMiddleware);
}
app.use('/admin/queues', serverAdapter.getRouter());

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
  console.log(`Dashboard em http://localhost:${port}/admin/queues`);
});


