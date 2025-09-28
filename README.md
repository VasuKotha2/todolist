# Node Todos API

## Run locally

```bash
npm ci
npm start
```

## Run tests

```bash
npm test
```

## Docker

```bash
docker build -t node-todos:latest .
docker run -p 3000:3000 --env COMMIT_SHA=$(git rev-parse --short HEAD) node-todos:latest
```

## Acceptance quick-checks

```bash
curl -s localhost:3000/healthz
curl -s -X POST localhost:3000/api/v1/todos -H "content-type: application/json" -d '{"title":"first"}'
curl -s localhost:3000/api/v1/todos
```