# Custom Basket Pricing UI

React single-page app to create custom baskets against the API exposed at `POST /baskets`. The base URL is supplied via `CUSTOM_BASKET_API_URL` and defaults to `http://localhost:8000/` (the UI appends `/baskets` automatically).

The UI also listens to `GET /baskets/stream` via Server-Sent Events to display live valuations of existing baskets.

## Features
- Dynamic form for basket details and position weights
- Metadata cleanup for each position prior to submission
- AG Grid-powered creation flow for new custom baskets
- Live basket valuation grid backed by Server-Sent Events
- Live request payload preview and JSON response viewer
- Ant Design powered layout and controls
- Environment-configured API endpoint via `CUSTOM_BASKET_API_URL`
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

## Building for Production
```bash
npm run build
```
The static assets will be generated in `dist/`.

## Docker Usage
Build the image (override the basket API base if needed):
```bash
docker build \
  --build-arg CUSTOM_BASKET_API_URL=http://localhost:8000/ \
  --build-arg VITE_PRICING_API_DOCS_URL=http://localhost:8000/docs#/ \
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
  --build-arg CUSTOM_BASKET_API_URL=http://localhost:8000/
  --build-arg VITE_PRICING_API_DOCS_URL=http://localhost:8000/docs#/
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
This repo ships with `.github/workflows/docker-publish.yml` which builds the Docker image on each push to `main` (and version tags) and pushes it to GitHub Container Registry.

- Optional: set the secret `CUSTOM_BASKET_API_URL` to override the default API endpoint baked into the build.
- Optional: set the secret `VITE_PRICING_API_DOCS_URL` to control the API documentation link shown in the UI.
- Update the `REGISTRY`/`IMAGE_NAME` env values if you prefer a different registry.

## Environment Variables
- `CUSTOM_BASKET_API_URL` — set during build to bake in the base API URL (defaults to `http://localhost:8000/`).
- `VITE_PRICING_API_DOCS_URL` — controls the documentation link surfaced inside the UI (defaults to `http://localhost:8000/docs#/`).

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
