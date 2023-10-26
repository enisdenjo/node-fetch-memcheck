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
1. Test

   - native

     1. Set port

        ```sh
        export PORT=3000
        ```

     1. Load test

        ```sh
        k6 run k6.js --vus 5 --duration 30s
        ```

     1. Force GC
        ```sh
        curl http://localhost:$PORT/gc
        ```

   - undici

     1. Set port

        ```sh
        export PORT=3001
        ```

     1. Load test

        ```sh
        k6 run k6.js --vus 5 --duration 30s
        ```

     1. Force GC
        ```sh
        curl http://localhost:$PORT/gc
        ```

   - @whatwg-node/fetch

     1. Set port

        ```sh
        export PORT=3002
        ```

     1. Load test

        ```sh
        k6 run k6.js --vus 5 --duration 30s
        ```

     1. Force GC
        ```sh
        curl http://localhost:$PORT/gc
        ```
