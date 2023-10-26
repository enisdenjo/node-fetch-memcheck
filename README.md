# Native fetch leaks memory on Node v19+

1. [Install Docker](https://docs.docker.com/engine/install)
1. [Install K6](https://k6.io/docs/get-started/installation)
1. Start containers
   ```sh
   docker compose up -d --build
   ```
1. Monitor resources
   ```sh
   docker stats
   ```
1. Load test
   ```sh
   PORT=3000 k6 run k6.js --vus 5 --duration 30s
   ```
1. Force GC
   ```sh
   curl http://localhost:3000/gc
   ```
