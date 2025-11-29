# Uber Like Queue System

Sistema de filas para processamento de corridas baseado em BullMQ.

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- PM2 (opcional, para produção)

### Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar ambiente:**
   ```bash
   cp env.example .env
   # Edite o .env com suas configurações
   ```

3. **Iniciar infraestrutura:**
   ```bash
   npm run docker:up
   ```

4. **Executar migrações do Prisma:**
   ```bash
   npx prisma generate
   ```

## 🏃‍♂️ Execução

### Desenvolvimento

**API + Worker juntos:**
```bash
npm run dev
```

**Apenas API:**
```bash
npm run start
```

**Apenas Worker:**
```bash
npm run worker
```

### Produção (com PM2)

**Instalar PM2 globalmente:**
```bash
npm install -g pm2
```

**Iniciar API e Worker:**
```bash
pm2 start ecosystem.config.js
```

**Comandos úteis do PM2:**
```bash
# Ver status dos processos
pm2 status

# Ver logs
pm2 logs

# Reiniciar processos
pm2 restart ecosystem.config.js

# Parar todos os processos
pm2 stop ecosystem.config.js

# Deletar processos
pm2 delete ecosystem.config.js
```

## 📊 Dashboard

O sistema inclui um dashboard para monitoramento das filas em `/admin/queues`.

- **Desenvolvimento:** Autenticação básica ativada
- **Produção:** Acesso direto (configure proteção adicional se necessário)

Credenciais padrão (desenvolvimento):
- Usuário: `admin`
- Senha: `admin123`

## 🔧 Scripts Disponíveis

- `npm run build` - Compila TypeScript
- `npm run start` - Inicia API (compila automaticamente)
- `npm run worker` - Inicia worker (compila automaticamente)
- `npm run prisma:generate` - Gera cliente Prisma
- `npm run prisma:format` - Formata schema Prisma
- `npm run docker:up` - Inicia containers Docker

## 📁 Estrutura do Projeto

```
src/
├── index.ts          # API Express
├── worker.ts         # Processador de filas
├── queue.ts          # Configuração da fila
├── lib/
│   └── prisma.ts     # Cliente Prisma
├── services/
│   └── corrida-service.ts
└── utils/
    └── idempotency.ts
```

## 🔒 Segurança

- Configure variáveis de ambiente adequadamente
- Use senhas fortes em produção
- O dashboard tem autenticação básica em desenvolvimento
- Considere proteção adicional para produção

## 📝 API Endpoints

- `GET /health` - Health check
- `POST /finalizar-corrida` - Enfileira finalização de corrida

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request
