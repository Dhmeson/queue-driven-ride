Como rodar (passo-a-passo)

Copie os arquivos para uma pasta.

Crie .env baseado em .env.example.

docker-compose up -d (leva Redis + Postgres).

Rode migrations: conectar no Postgres (psql) e rodar migrations/schema.sql.

npm install

npm start (API + dashboard em http://localhost:3000/admin/queues)

Em outro terminal: npm run worker

Teste com curl / Postman:

curl -X POST http://localhost:3000/finalizar-corrida \
  -H "Content-Type: application/json" \
  -d '{"corridaId":"<uuid-da-corrida>", "motoristaId":"<uuid-do-motorista>"}'
