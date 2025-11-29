import { prisma } from '../lib/prisma.js';
import { Prisma, type Corrida } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export async function buscarCorrida(corridaId: string): Promise<Corrida | null> {
  return prisma.corrida.findUnique({ where: { id: corridaId } });
}

export function calcularValor(corrida: Corrida): number {
  const tarifaBase = 3.5;
  const porKm = 2.0;
  const distancia =
    corrida.distanciaKm != null
      ? (corrida.distanciaKm as unknown as Prisma.Decimal).toNumber
        ? (corrida.distanciaKm as unknown as Prisma.Decimal).toNumber()
        : Number(corrida.distanciaKm)
      : 1;
  const valor = tarifaBase + porKm * distancia;
  return Math.round(valor * 100) / 100;
}

export async function atualizarStatusCorrida(corridaId: string, status: string, valor: number): Promise<void> {
  await prisma.corrida.update({
    where: { id: corridaId },
    data: {
      status,
      valor
    }
  });
}

export async function adicionarSaldoMotorista(motoristaId: string, valor: number): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.motorista.update({
      where: { id: motoristaId },
      data: { saldo: { increment: valor } }
    });

    await tx.pagamento.create({
      data: {
        id: uuidv4(),
        corridaId: null,
        motoristaId,
        valor
      }
    });
  });
}


