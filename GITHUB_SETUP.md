# 📦 GitHub Repository Setup & Deployment Guide

Complete guide to set up your Academic Management Platform repository and deploy to production.

## 🎯 GitHub Repository Setup

### 1. Create Repository

1. **Go to GitHub.com** and create a new repository
2. **Repository name**: `AcademicCRM` (or your preferred name)
3. **Visibility**: Public or Private
4. **Initialize**: Don't initialize with README (we have existing files)

### 2. Push Your Code

From your local development environment:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Academic Management Platform with production infrastructure"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/AcademicCRM.git

# Push to GitHub
git push -u origin main
```

### 3. Configure Repository Settings

In your GitHub repository settings:

1. **Go to Settings > Secrets and Variables > Actions**
2. **Add the following secrets**:
   ```
   DATABASE_URL = postgresql://username:password@host:5432/database
   SESSION_SECRET = your_32_character_secure_session_secret
   OPENAI_API_KEY = sk_your_openai_api_key_here
   ```

3. **Enable GitHub Actions**:
   - Go to Actions tab
   - Enable workflows for your repository

## 🚀 Automated Deployments

Your repository now includes CI/CD pipelines for automatic deployments:

### GitHub Actions Pipeline

The `.github/workflows/ci.yml` file automatically:
- ✅ Runs tests on every push
- ✅ Builds Docker images
- ✅ Scans for security vulnerabilities
- ✅ Deploys to staging on `develop` branch
- ✅ Deploys to production on `main` branch

### Manual Deployment Trigger

To manually deploy:
1. Go to **Actions** tab in your repository
2. Select **"CI/CD Pipeline"**
3. Click **"Run workflow"**
4. Choose branch and environment

## 🌍 Platform-Specific Deployments

### 1. Render Deployment

**One-click deployment from GitHub:**

1. **Visit [Render.com](https://render.com)** and sign up
2. **Connect GitHub** account
3. **Create Web Service** and select your repository
4. **Configure**:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     DATABASE_URL = your_postgresql_url
     SESSION_SECRET = your_session_secret
     OPENAI_API_KEY = your_openai_key
     ```
5. **Deploy** - Render builds and deploys automatically

**Database Setup on Render:**
1. **Create PostgreSQL database** in Render dashboard
2. **Copy connection string** to DATABASE_URL environment variable

### 2. Vercel Deployment

**Deploy directly from GitHub:**

1. **Visit [Vercel.com](https://vercel.com)** and sign in
2. **Import project** from GitHub
3. **Configure build settings**:
   - **Framework**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Set environment variables** in Vercel dashboard
5. **Deploy** - automatic deployments on every push

### 3. Railway Deployment

**GitHub integration:**

1. **Visit [Railway.app](https://railway.app)**
2. **New Project > Deploy from GitHub repo**
3. **Select your repository**
4. **Add PostgreSQL service** from marketplace
5. **Set environment variables**
6. **Deploy** - automatic deployments enabled

### 4. Fly.io Deployment

**Command-line deployment:**

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly
fly auth login

# Deploy from your repository
fly launch

# Set environment variables
fly secrets set DATABASE_URL="postgresql://..."
fly secrets set SESSION_SECRET="your_secret"
fly secrets set OPENAI_API_KEY="sk_..."

# Deploy
fly deploy
```

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (EKS, GKE, AKS, or local)
- kubectl configured
- Docker registry access

### Quick Setup

1. **Build and push Docker image**:
```bash
# Build image
docker build -t your-registry/academic-crm:latest .

# Push to registry
docker push your-registry/academic-crm:latest
```

2. **Update image in Kubernetes manifests**:
```bash
# Edit k8s/base/app-deployment.yaml
# Change image: academic-crm:latest to your-registry/academic-crm:latest
```

3. **Create secrets**:
```bash
kubectl create namespace academic-crm
kubectl create secret generic academic-crm-secrets \
  --from-literal=DATABASE_URL="postgresql://..." \
  --from-literal=SESSION_SECRET="your_secret" \
  --from-literal=OPENAI_API_KEY="sk_..." \n  -n academic-crm
```

4. **Deploy**:
```bash
kubectl apply -k k8s/overlays/production
```

5. **Verify deployment**:
```bash
kubectl get pods -n academic-crm
kubectl get service -n academic-crm
```

### Cloud Provider Setup

**AWS EKS:**
```bash
# Create cluster
eksctl create cluster --name academic-crm --region us-west-2

# Deploy
kubectl apply -k k8s/overlays/production
```

**Google GKE:**
```bash
# Create cluster
gcloud container clusters create academic-crm \
  --zone us-central1-a --machine-type e2-standard-2

# Deploy
kubectl apply -k k8s/overlays/production
```

**Azure AKS:**
```bash
# Create cluster
az aks create --resource-group academic-crm \
  --name academic-crm-cluster --node-count 3

# Deploy
kubectl apply -k k8s/overlays/production
```

## 📊 Monitoring Setup

### Prometheus & Grafana

After Kubernetes deployment:

```bash
# Deploy monitoring stack
kubectl apply -f k8s/monitoring/prometheus.yaml
kubectl apply -f k8s/monitoring/grafana.yaml

# Access Grafana
kubectl port-forward -n academic-crm-monitoring svc/grafana 3000:3000

# Login to Grafana (admin/admin, then change password)
# Import dashboards from k8s/monitoring/dashboards/
```

### Application Metrics

Your application exposes metrics at `/metrics`:
- Application uptime
- Memory usage
- Request rates
- Database connections

## 🔒 Security Configuration

### SSL/TLS Setup

**For Kubernetes with Let's Encrypt:**

```bash
# Install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace --set installCRDs=true

# Apply SSL configuration
kubectl apply -f k8s/base/ingress.yaml
```

### Security Scanning

**Automated security scans included:**
- Container vulnerability scanning with Trivy
- Dependency vulnerability checks
- Code quality analysis
- Security headers validation

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Required
DATABASE_URL=postgresql://username:password@host:5432/database
SESSION_SECRET=minimum_32_character_secure_random_string

# Optional
OPENAI_API_KEY=sk_your_openai_api_key_here
NODE_ENV=production
PORT=5000
LOG_LEVEL=info
CORS_ORIGIN=https://your-domain.com
SECURE_COOKIES=true
TRUST_PROXY=true
```

### Database Setup

**After deployment, initialize database:**

```bash
# For cloud deployments
curl -X POST https://your-domain.com/api/setup

# For Kubernetes
kubectl exec -n academic-crm deployment/academic-crm-app -- npm run db:push
```

## 📈 Performance Optimization

### Scaling Configuration

**Horizontal Pod Autoscaler (Kubernetes):**
```bash
kubectl autoscale deployment academic-crm-app \
  --cpu-percent=70 --min=3 --max=20 -n academic-crm
```

**CDN Setup:**
- Configure CloudFlare or AWS CloudFront
- Enable caching for static assets
- Set appropriate cache headers

### Database Optimization

- Connection pooling enabled by default
- Query optimization with proper indexes
- Regular maintenance and backups

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Database Connection:**
```bash
# Test connection
curl https://your-domain.com/health

# Check logs
kubectl logs -n academic-crm deployment/academic-crm-app
```

**SSL Certificate Issues:**
```bash
# Check certificate status
kubectl describe certificate -n academic-crm

# Force renewal
kubectl delete certificate academic-crm-tls -n academic-crm
```

## ✅ Deployment Checklist

Before going live:

- [ ] Domain name configured
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Monitoring alerts set up
- [ ] Environment variables secured
- [ ] Health checks passing
- [ ] Performance tested
- [ ] Security scan completed

## 📞 Support Resources

### Documentation
- [Architecture Guide](./ARCHITECTURE.md)
- [Full Deployment Guide](./DEPLOYMENT.md)
- [Quick Deploy Options](./QUICK_DEPLOY.md)

### Community
- [GitHub Issues](https://github.com/YOUR_USERNAME/AcademicCRM/issues)
- [GitHub Discussions](https://github.com/YOUR_USERNAME/AcademicCRM/discussions)

---

**Congratulations!** Your Academic Management Platform is now ready for production with enterprise-grade infrastructure, monitoring, and security.