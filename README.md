# Custom Basket Pricing UI

React single-page app to create custom baskets against the API exposed at `POST /baskets`. The base URL is supplied via `VITE_CUSTOM_BASKET_API_URL` and defaults to `http://localhost:8000/` (the UI appends `/baskets` automatically).

The UI polls `GET /baskets` every second to display live valuations of existing baskets.

## Features
- Dynamic form for basket details and position weights
- Metadata cleanup for each position prior to submission
- AG Grid-powered creation flow for new custom baskets
- Clipboard paste support to import tickers and weights directly from spreadsheets
- Live basket valuation grid backed by polling (AWS Lambda compatible)
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

## AWS Amplify Deployment (Manual S3 Upload)
This project uses AWS Amplify to serve the application via CloudFront CDN, with GitHub Actions handling the build and S3 upload.

### Architecture
1. **GitHub Actions** builds the app and syncs to S3 bucket `custom-basket-ui` (see `.github/workflows/docker-publish.yml`)
2. **AWS Amplify** is configured to serve content from that S3 bucket via CloudFront
3. **Result**: Automatic deployment on every push to `main` with CDN distribution

### Initial Amplify Setup (One-time)
1. **Create Amplify app**:
   - Sign in to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Deploy without Git provider"
   - Select "Amazon S3" as the method
   - Set S3 location: `s3://custom-basket-ui/`
   - Click "Save and deploy"

2. **Configure custom domain** (optional):
   - Go to "App settings" → "Domain management"
   - Click "Add domain"
   - Follow the instructions to configure DNS records

### Deployment Process
Every push to `main` triggers:
1. GitHub Actions builds the app with `npm run build`
2. Built files from `dist/` are synced to S3 bucket `custom-basket-ui`
3. AWS Amplify serves the updated content via CloudFront CDN
4. App is available at your Amplify URL (e.g., `https://main.xxxxxx.amplifyapp.com`)

### Required GitHub Secrets
Set these in your repository (Settings → Secrets and variables → Actions):
- `AWS_ROLE_ARN` - IAM role ARN for OIDC authentication to deploy to S3

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
