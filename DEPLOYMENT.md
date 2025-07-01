# 🚀 Production Deployment Guide

Complete deployment guide for the Academic Management Platform across multiple environments and cloud providers.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Provider Setup](#cloud-provider-setup)
- [Monitoring & Observability](#monitoring--observability)
- [Security Configuration](#security-configuration)
- [CI/CD Pipeline](#cicd-pipeline)
- [Troubleshooting](#troubleshooting)

## 🛠️ Prerequisites

### System Requirements

- **Node.js**: 20.x or higher
- **Docker**: 24.x or higher
- **Kubernetes**: 1.25+ (kubectl configured)
- **Terraform**: 1.5+ (for infrastructure)
- **Helm**: 3.12+ (for package management)

### Required Accounts & Services

- **PostgreSQL Database** (local or cloud)
- **OpenAI API Key** (optional, has fallbacks)
- **Container Registry** (Docker Hub, ECR, GCR)
- **Cloud Provider Account** (AWS, GCP, or Azure)

## 🔧 Environment Setup

### 1. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/bonaventuresimeon/AcademicCRM.git
cd AcademicCRM

# Install dependencies with conflict resolution
./scripts/install-deps.sh

# Copy and configure environment
cp .env.example .env
# Edit .env with your configuration
```

### 2. Environment Variables

Create `.env` file with required variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/academic_crm
SESSION_SECRET=your-secure-session-secret-min-32-chars

# AI Services (Optional)
OPENAI_API_KEY=sk-your-openai-api-key

# Application Settings
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Security Settings
SECURE_COOKIES=true
TRUST_PROXY=true
CORS_ORIGIN=https://your-domain.com
```

## 💻 Local Development

### Quick Start

```bash
# Start development environment
npm run dev

# In separate terminal, push database schema
npm run db:push

# Access application
open http://localhost:5000
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☸️ Kubernetes Deployment

### 1. Cluster Preparation

```bash
# Create namespace
kubectl create namespace academic-crm

# Apply security configurations
kubectl apply -f k8s/security/rbac.yaml
```

### 2. Configure Secrets

```bash
# Create database secret
kubectl create secret generic academic-crm-secrets \
  --from-literal=DATABASE_URL="postgresql://user:pass@host:5432/db" \
  --from-literal=SESSION_SECRET="your-session-secret" \
  --from-literal=OPENAI_API_KEY="sk-your-key" \
  -n academic-crm
```

### 3. Deploy with Kustomize

```bash
# Deploy to production
kubectl apply -k k8s/overlays/production

# Check deployment status
kubectl get pods -n academic-crm -w

# View application logs
kubectl logs -n academic-crm -l app.kubernetes.io/name=academic-crm
```

### 4. Verify Deployment

```bash
# Check health endpoint
kubectl port-forward -n academic-crm svc/academic-crm-service 8080:80
curl http://localhost:8080/health

# Check database connection
kubectl exec -n academic-crm deployment/academic-crm-app -- npm run db:test
```

## ☁️ Cloud Provider Setup

### AWS with Terraform

1. **Configure AWS credentials**:
```bash
aws configure
export AWS_REGION=us-west-2
```

2. **Deploy infrastructure**:
```bash
cd devops/terraform
terraform init
terraform plan -var="environment=prod"
terraform apply
```

3. **Configure kubectl**:
```bash
aws eks update-kubeconfig --region us-west-2 --name academic-crm-prod
```

4. **Deploy application**:
```bash
# Update image in k8s manifests
kubectl apply -k k8s/overlays/production
```

### GCP with Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/academic-crm
gcloud run deploy academic-crm \
  --image gcr.io/PROJECT_ID/academic-crm \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Azure Container Instances

```bash
# Create resource group
az group create --name academic-crm --location eastus

# Deploy container
az container create \
  --resource-group academic-crm \
  --name academic-crm-app \
  --image academic-crm:latest \
  --dns-name-label academic-crm \
  --ports 5000
```

## 📊 Monitoring & Observability

### Prometheus & Grafana Setup

```bash
# Deploy monitoring stack
kubectl apply -f k8s/monitoring/prometheus.yaml
kubectl apply -f k8s/monitoring/grafana.yaml

# Access Grafana dashboard
kubectl port-forward -n academic-crm-monitoring svc/grafana 3000:3000
# Login: admin / (check secret for password)
```

### Custom Metrics

The application exposes metrics at `/metrics`:

- `academic_crm_uptime_seconds`: Application uptime
- `academic_crm_memory_usage_bytes`: Memory usage
- `academic_crm_version_info`: Version information

### Log Aggregation

```bash
# View aggregated logs
kubectl logs -n academic-crm -l app.kubernetes.io/name=academic-crm --tail=100

# Stream logs
kubectl logs -n academic-crm -l app.kubernetes.io/name=academic-crm -f
```

## 🔒 Security Configuration

### 1. Network Policies

```bash
# Apply network restrictions
kubectl apply -f k8s/security/rbac.yaml
```

### 2. SSL/TLS Configuration

```bash
# Install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --set installCRDs=true

# Apply SSL ingress
kubectl apply -f k8s/base/ingress.yaml
```

### 3. Security Scanning

```bash
# Scan container images
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image academic-crm:latest

# Kubernetes security scan
kubectl run kube-bench --image=aquasec/kube-bench:latest --restart=Never
```

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

1. **Configure secrets** in GitHub repository:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `OPENAI_API_KEY`
   - `KUBE_CONFIG` (base64 encoded)

2. **Pipeline triggers**:
   - Push to `main`: Production deployment
   - Push to `develop`: Staging deployment
   - Pull requests: Testing and validation

### Manual Deployment

```bash
# Using deployment script
./scripts/deploy.sh production

# Using Ansible
ansible-playbook devops/ansible/playbooks/deploy.yml \
  -e env=production \
  -e tag=v1.0.0
```

## 🐛 Troubleshooting

### Common Issues

#### Pods Not Starting

```bash
# Check pod events
kubectl describe pod -n academic-crm <pod-name>

# Check resource limits
kubectl top pods -n academic-crm

# View detailed logs
kubectl logs -n academic-crm <pod-name> --previous
```

#### Database Connection Failed

```bash
# Test database connectivity
kubectl exec -n academic-crm deployment/academic-crm-app -- \
  psql $DATABASE_URL -c "SELECT 1"

# Check database logs
kubectl logs -n academic-crm deployment/postgres
```

#### Image Pull Errors

```bash
# Check image exists
docker pull academic-crm:latest

# Verify registry credentials
kubectl get secret regcred -n academic-crm -o yaml
```

#### Ingress Not Working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Verify DNS resolution
nslookup your-domain.com

# Check SSL certificate
kubectl describe certificate -n academic-crm
```

### Performance Issues

#### High Memory Usage

```bash
# Check memory metrics
kubectl top pods -n academic-crm

# Analyze heap dumps
kubectl exec -n academic-crm deployment/academic-crm-app -- \
  node --inspect --heap-prof index.js
```

#### Slow Response Times

```bash
# Check application metrics
curl http://your-domain.com/metrics

# Analyze database performance
kubectl exec -n academic-crm deployment/postgres -- \
  psql -c "SELECT * FROM pg_stat_activity"
```

### Recovery Procedures

#### Database Recovery

```bash
# Restore from backup
kubectl exec -n academic-crm deployment/postgres -- \
  psql $DATABASE_URL < backup.sql

# Run migrations
kubectl exec -n academic-crm deployment/academic-crm-app -- \
  npm run db:push
```

#### Application Recovery

```bash
# Restart deployment
kubectl rollout restart deployment/academic-crm-app -n academic-crm

# Rollback to previous version
kubectl rollout undo deployment/academic-crm-app -n academic-crm
```

## 📈 Scaling Guide

### Horizontal Scaling

```bash
# Manual scaling
kubectl scale deployment academic-crm-app --replicas=10 -n academic-crm

# Configure HPA
kubectl autoscale deployment academic-crm-app \
  --cpu-percent=70 \
  --min=3 \
  --max=20 \
  -n academic-crm
```

### Vertical Scaling

```bash
# Update resource limits
kubectl patch deployment academic-crm-app -n academic-crm -p \
  '{"spec":{"template":{"spec":{"containers":[{"name":"academic-crm","resources":{"limits":{"memory":"4Gi","cpu":"2000m"}}}]}}}}'
```

## 🔧 Maintenance

### Regular Tasks

```bash
# Update dependencies
./scripts/install-deps.sh

# Security patches
kubectl apply -f k8s/security/rbac.yaml

# Database maintenance
kubectl exec -n academic-crm deployment/postgres -- \
  psql -c "VACUUM ANALYZE"
```

### Backup Procedures

```bash
# Database backup
kubectl exec -n academic-crm deployment/postgres -- \
  pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Application backup
kubectl create backup academic-crm-backup-$(date +%Y%m%d)
```

## 📞 Support

### Getting Help

1. **Check logs**: Application and infrastructure logs
2. **Review metrics**: Prometheus/Grafana dashboards
3. **Validate configuration**: Environment variables and secrets
4. **Test connectivity**: Database and external services

### Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Terraform Documentation](https://terraform.io/docs/)
- [Project Repository](https://github.com/bonaventuresimeon/AcademicCRM)

---

**Note**: This deployment guide covers production-ready configurations. For development environments, simpler setups are available in the main README.