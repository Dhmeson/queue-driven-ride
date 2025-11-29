module.exports = {
  apps: [
    {
      name: 'uber-api',
      script: 'npm run start',
      instances: process.env.NODE_ENV === 'production' ? 'max' : 1,
      exec_mode: process.env.NODE_ENV === 'production' ? 'cluster' : 'fork',
      env: {
        NODE_ENV: 'dev',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // Configuração de logs
      log_file: './logs/api.log',
      out_file: './logs/api-out.log',
      error_file: './logs/api-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Reinicialização automática
      autorestart: true,
      max_memory_restart: '500M',
      // Tempo de espera para iniciar
      kill_timeout: 5000,
      // Configuração de cluster
      node_args: '--max-old-space-size=4096'
    },
    {
      name: 'uber-worker',
      script: 'npm run worker',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      // Configuração de logs
      log_file: './logs/worker.log',
      out_file: './logs/worker-out.log',
      error_file: './logs/worker-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Reinicialização automática
      autorestart: true,
      max_memory_restart: '300M',
      // Tempo de espera para iniciar
      kill_timeout: 3000
    }
  ]
};
