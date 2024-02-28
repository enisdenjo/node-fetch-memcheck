1. [Install Docker](https://docs.docker.com/engine/install)
1. [Install K6](https://k6.io/docs/get-started/installation)
1. Choose a service (`<service>`):

   - native
   - undici
   - whatwg-node
   - node-fetch

1. Set port

   ```sh
   export PORT=3000
   ```

   - (optional) Consume the response body

     ```sh
     export CONSUME_BODY=true
     ```

1. Start containers

   ```sh
   docker compose up httpbin <service> -d --build
   ```

1. Run memcheck

   ```sh
   # ./memcheck.sh <service> <VUs> <duration>
   ./memcheck.sh <service> 100 30s
   ```
