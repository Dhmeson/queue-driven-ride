import { prisma } from '../lib/prisma.js';

export async function markJobIfNotProcessed(jobId: string, corridaId?: string): Promise<boolean> {
  try {
    await prisma.corridaJob.create({
      data: {
        id: jobId,
        corridaId: corridaId ?? null
      }
    });
    return true;
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return false;
    }
    throw e;
  }
}


