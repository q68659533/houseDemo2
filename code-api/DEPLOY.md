# House Price Prediction API — Deployment Guide

This guide covers deploying the containerized FastAPI service to AWS ECS/Fargate and GCP Cloud Run.

## Prerequisites

- Docker image built: `docker build -t house-price-api .` (from `code/` directory)
- A container registry accessible from your cloud provider
- CLI tools: `aws` (AWS CLI v2) or `gcloud` (Google Cloud SDK)

## AWS — ECS with Fargate

### 1. Create an ECR Repository

```bash
aws ecr create-repository --repository-name house-price-api
```

### 2. Push Image to ECR

```bash
aws ecr get-login-password | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
docker tag house-price-api:latest <account-id>.dkr.ecr.<region>.amazonaws.com/house-price-api:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/house-price-api:latest
```

### 3. Create an ECS Task Definition

Use the "Fargate" launch type. Create a task definition with:
- **Container image**: the ECR URI from step 2
- **Port mappings**: container port 8000, protocol TCP
- **CPU/Memory**: 256 CPU units / 512 MB is sufficient for this lightweight service
- **Environment**: AWS Fargate (serverless)

### 4. Create an ECS Service

- Attach the task definition from step 3
- Launch type: Fargate
- Desired tasks: 1 (scale up as needed)
- Place the service in a VPC with a public subnet (or private subnet + load balancer)
- Assign a security group that allows inbound TCP on port 8000
- Enable "Auto-assign public IP" if using a public subnet without a load balancer

### 5. Access the API

- If using a public IP: `http://<public-ip>:8000`
- If using an Application Load Balancer: configure a listener on port 80/443 forwarding to target group port 8000
- Swagger UI: `http://<endpoint>/docs`

## GCP — Cloud Run

### 1. Create an Artifact Registry Repository

```bash
gcloud artifacts repositories create house-price-api \
    --repository-format=docker \
    --location=<region>
```

### 2. Push Image to Artifact Registry

```bash
gcloud auth configure-docker <region>-docker.pkg.dev
docker tag house-price-api:latest <region>-docker.pkg.dev/<project-id>/house-price-api/house-price-api:latest
docker push <region>-docker.pkg.dev/<project-id>/house-price-api/house-price-api:latest
```

### 3. Deploy to Cloud Run

```bash
gcloud run deploy house-price-api \
    --image=<region>-docker.pkg.dev/<project-id>/house-price-api/house-price-api:latest \
    --platform=managed \
    --region=<region> \
    --port=8000 \
    --allow-unauthenticated \
    --memory=512Mi \
    --cpu=1
```

### 4. Access the API

- Cloud Run prints the service URL after deployment (e.g., `https://house-price-api-<hash>-<region>.a.run.app`)
- Swagger UI: `https://<service-url>/docs`

## Health Check

After deployment, verify the service is healthy:

```bash
curl <endpoint>/health
# Expected: {"status": "healthy"}
```

## Notes

- Model files are baked into the Docker image — no external volume or model server needed.
- The service is stateless; scale horizontally by increasing task/revision count.
- For production, consider placing the service behind a CDN or API gateway with rate limiting.
- No environment variables are required for the service to run with default settings.
