module.exports = {
  apps: [
    {
      name: 'nodejs_apis',
      script: './src/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3100
      },
    },
  ],
};
