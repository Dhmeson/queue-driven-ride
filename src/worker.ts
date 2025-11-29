import { Worker, type Job } from 'bullmq';
import { Redis } from 'ioredis';
import 'dotenv/config';

import { buscarCorrida, calcularValor, atualizarStatusCorrida, adicionarSaldoMotorista } from './services/corrida-service.js';
import { markJobIfNotProcessed } from './utils/idempotency.js';

type FinalizarCorridaJob = {
  corridaId: string;
  motoristaId: string;
};

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null
});

const worker = new Worker<FinalizarCorridaJob>(
  'finalizarCorrida',
  async (job: Job<FinalizarCorridaJob>) => {
    const { corridaId, motoristaId } = job.data;
    const jobId = job.id as string;

    console.log('[Worker] recebido job', jobId, 'corrida', corridaId);

    const ok = await markJobIfNotProcessed(jobId, corridaId);
    if (!ok) {
      console.log('[Worker] job já processado — ignorando', jobId);
      return { skipped: true };
    }

    const corrida = await buscarCorrida(corridaId);
    if (!corrida) {
      console.log('[Worker] corrida não encontrada', corridaId);
      throw new Error('Corrida não encontrada: ' + corridaId);
    }

    const valor = calcularValor(corrida);
    await atualizarStatusCorrida(corridaId, 'finalizada', valor);
    await adicionarSaldoMotorista(motoristaId, valor);

    console.log(`[Worker] corrida ${corridaId} finalizada. valor=${valor}`);
    return { success: true, valor };
  },
  { connection }
);

worker.on('failed', (job, err) => {
  console.error(`[Worker] job ${job?.id} failed:`, err?.message);
});


