// Processamento de pagamento de corrida
await paymentQueue.add(
  'process-ride-payment',
  {
    rideId: '123',
    userId: 'user-456',
    amount: 25.50,
    paymentMethod: 'credit-card',
    cardLast4: '1234'
  },
  {
    // Tenta até 5 vezes
    attempts: 5,
    
    // Espera crescente entre tentativas (2s, 4s, 8s, 16s, 32s)
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    
    // Processa 2 minutos após corrida terminar
    delay: 120000,
    
    // Pagamentos urgentes têm prioridade
    priority: 1,
    
    // Se demorar mais de 1 minuto, algo está errado
    timeout: 60000,
    
    // Mantém jobs completados por 24h para auditoria
    removeOnComplete: {
      age: 86400 // segundos
    },
    
    // Não remove falhas (preciso investigar)
    removeOnFail: false,
    
    // Identificador único para evitar duplicatas
    jobId: `payment-ride-123`
  }
);
