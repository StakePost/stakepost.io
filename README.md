# Monorepo for stakepost.io website

## Docker

### To build docker for an app

```
docker build -t stakepost/web:1.0.0 -t stakepost/web:latest .
```

### To run dockerized app

```
docker run --env-file ./packages/backend/.env -p 5000:3000 --name stakepost stakepost/web
```