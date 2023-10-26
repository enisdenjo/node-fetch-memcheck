# Native fetch leaks memory on Node v19+

1. [Install Docker](https://docs.docker.com/engine/install)
1. [Install K6](https://k6.io/docs/get-started/installation)
1. Memcheck

   - native

     1. Set port

        ```sh
        export PORT=3000
        ```

     1. Start containers

        ```sh
        docker compose up httpbin native -d --build
        ```

     1. Load test and force GC

        ```sh
        k6 run k6.js --vus 5 --duration 30s && curl http://localhost:$PORT/gc
        ```

     1. Check resources

        ```sh
        docker stats
        ```

     1. _Repeat load test and check resources_

   - undici

     1. Set port

        ```sh
        export PORT=3001
        ```

     1. Start containers

        ```sh
        docker compose up httpbin undici -d --build
        ```

     1. Load test and force GC

        ```sh
        k6 run k6.js --vus 5 --duration 30s && curl http://localhost:$PORT/gc
        ```

     1. Check resources

        ```sh
        docker stats
        ```

     1. _Repeat load test and check resources_

   - @whatwg-node/fetch

     1. Set port

        ```sh
        export PORT=3002
        ```

     1. Start containers

        ```sh
        docker compose up httpbin whatwg-node -d --build
        ```

     1. Load test and force GC

        ```sh
        k6 run k6.js --vus 5 --duration 30s && curl http://localhost:$PORT/gc
        ```

     1. Check resources

        ```sh
        docker stats
        ```

     1. _Repeat load test and check resources_
