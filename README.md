# Custom Basket Pricing UI

React single-page app to create custom baskets against the API exposed at `POST /baskets`. The base URL is supplied via `VITE_CUSTOM_BASKET_API_URL` and defaults to `http://localhost:8000/` (the UI appends `/baskets` automatically).

The UI also listens to `GET /baskets/stream` via Server-Sent Events to display live valuations of existing baskets.

## Features
- Dynamic form for basket details and position weights
- Metadata cleanup for each position prior to submission
- AG Grid-powered creation flow for new custom baskets
- Clipboard paste support to import tickers and weights directly from spreadsheets
- Live basket valuation grid backed by Server-Sent Events
- Live request payload preview and JSON response viewer
- Ant Design powered layout and controls
- Environment-configured API endpoint via `VITE_CUSTOM_BASKET_API_URL`
- Unit tests with Vitest and Testing Library
- Docker image to build and serve the production bundle via Nginx

## Local Development
```bash
npm install
npm run dev
```
Visit http://localhost:5173 and make sure the basket API is reachable at the configured endpoint.

## Testing
```bash
npm test
```

Generate a coverage report (used by SonarCloud):
```bash
npm run test:coverage
```

## Building for Production
```bash
npm run build
```
The static assets will be generated in `dist/`.

## Docker Usage
Build the image (override the basket API base if needed):
```bash
docker build \
  --build-arg VITE_CUSTOM_BASKET_API_URL=http://localhost:8000/ \
  -t custom-basket-ui .
```

Run the container:
```bash
docker run -p 8080:80 custom-basket-ui
```

The app will be available at http://localhost:8080

## Docker Compose
Spin up the container with Docker Compose (automatically builds the image):
```bash
docker compose up --build
```

Override the basket API base during build:
```bash
docker compose build \
  --build-arg VITE_CUSTOM_BASKET_API_URL=http://localhost:8000/
docker compose up
```

## Kubernetes Deployment
1. Build and push the container image to a registry your cluster can pull from (update `image` in `k8s/deployment.yaml`).
2. Apply the manifests:
   ```bash
   kubectl apply -f k8s/
   ```
3. Expose the `Service` externally (e.g. via an `Ingress` or `LoadBalancer` service) if you need public access.

## GitHub Actions
This repo ships with the following workflows:

- `.github/workflows/docker-publish.yml` builds the Docker image on each push to `main` (and version tags) and publishes it to GitHub Container Registry. The workflow targets the `prd` GitHub environment.
  - Optional: set the secret `VITE_CUSTOM_BASKET_API_URL` to override the default API endpoint baked into the build.
  - Update the `REGISTRY`/`IMAGE_NAME` env values if you prefer a different registry.
- `.github/workflows/sonar.yml` runs SonarCloud quality gate checks on pushes and pull requests. The workflow targets the `prd` GitHub environment.
  - Add the repository secret `SONAR_TOKEN` (generated from SonarCloud) and repository variables `SONAR_ORGANIZATION` and `SONAR_PROJECT_KEY` before enabling the workflow.
  - The workflow runs `npm run test:coverage` (to emit `coverage/lcov.info`) and `npm run build` prior to invoking the Sonar scan.

## Environment Variables
- `VITE_CUSTOM_BASKET_API_URL` — set during build to bake in the base API URL (defaults to `http://localhost:8000/`).

## Project Structure
```
├── Dockerfile
├── docker
│   └── nginx.conf
├── src
│   ├── App.tsx
│   ├── components/   # component helpers (future expansion)
│   ├── hooks/
│   ├── styles/
│   ├── test/
│   ├── types/
│   └── utils/
```
