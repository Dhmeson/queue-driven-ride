uber-like-queue/
├─ package.json
├─ docker-compose.yml
├─ .env.example
├─ src/
│  ├─ index.js               # API (Express) + bull-board
│  ├─ queue.js               # criação da Queue
│  ├─ worker.js              # worker que processa jobs
│  ├─ services/
│  │  └─ corridaService.js   # lógica de negócio (DB)
│  ├─ db.js                  # conexão Postgres (pg)
│  └─ utils/
│     └─ idempotency.js      # helpers idempotência
└─ migrations/
   └─ schema.sql
