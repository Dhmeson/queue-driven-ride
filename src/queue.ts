import { Queue } from 'bullmq';
import {Redis} from 'ioredis';
import 'dotenv/config';

type FinalizarCorridaJob = {
  corridaId: string;
  motoristaId: string;
};

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT || 6379),
  maxRetriesPerRequest: null
});

export const corridaQueue = new Queue<FinalizarCorridaJob>('finalizarCorrida', { connection });
export const connectionClient = connection;


