# Kubernetes Deployment for Academic Management Platform

This directory contains Kubernetes manifests and configurations for deploying the Academic Management Platform in production-ready clusters.

## 📁 Directory Structure

```
k8s/
├── base/                           # Base Kubernetes manifests
│   ├── namespace.yaml             # Namespaces for app and monitoring
│   ├── configmap.yaml             # Application configuration
│   ├── secret.yaml                # Application secrets template
│   ├── postgres.yaml              # PostgreSQL database deployment
│   ├── app-deployment.yaml        # Main application deployment
│   ├── service.yaml               # Service definitions
│   ├── ingress.yaml               # Ingress with SSL termination
│   ├── hpa.yaml                   # Horizontal Pod Autoscaler
│   └── kustomization.yaml         # Base Kustomize configuration
├── overlays/                      # Environment-specific overlays
│   ├── development/               # Development environment
│   ├── staging/                   # Staging environment
│   └── production/                # Production environment
│       ├── kustomization.yaml    # Production Kustomize config
│       ├── production.env         # Production environment variables
│       └── patches/               # Production-specific patches
├── monitoring/                    # Monitoring stack
│   ├── prometheus.yaml            # Prometheus monitoring
│   └── grafana.yaml               # Grafana dashboards
└── security/                      # Security configurations
    └── rbac.yaml                  # RBAC, NetworkPolicy, Resource limits
```

## 🚀 Quick Start

### Prerequisites

- Kubernetes cluster (v1.25+)
- kubectl configured for your cluster
- Kustomize (included in kubectl v1.14+)
- Helm (for monitoring stack - optional)

### 1. Create Namespaces

```bash
kubectl apply -f k8s/base/namespace.yaml
```

### 2. Configure Secrets

Edit the production environment file:

```bash
cp k8s/overlays/production/production.env.example k8s/overlays/production/production.env
# Edit with your actual values
```

### 3. Deploy to Production

```bash
# Apply with Kustomize
kubectl apply -k k8s/overlays/production

# Or build and apply
kustomize build k8s/overlays/production | kubectl apply -f -
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods -n academic-crm

# Check services
kubectl get svc -n academic-crm

# Check ingress
kubectl get ingress -n academic-crm

# View logs
kubectl logs -n academic-crm -l app.kubernetes.io/name=academic-crm
```

## 🏗️ Architecture Overview

### Application Components

- **Frontend + Backend**: Single container serving React frontend and Express API
- **Database**: PostgreSQL with persistent storage
- **Load Balancer**: Kubernetes Service with LoadBalancer type
- **Ingress**: NGINX Ingress Controller with SSL termination
- **Autoscaling**: HPA based on CPU and memory metrics

### Monitoring Stack

- **Prometheus**: Metrics collection and alerting
- **Grafana**: Visualization and dashboards
- **AlertManager**: Alert routing and notifications

### Security Features

- **RBAC**: Role-based access control
- **Network Policies**: Pod-to-pod communication restrictions
- **Resource Limits**: CPU and memory quotas
- **Security Context**: Non-root containers, readonly filesystems

## 🔧 Configuration

### Environment Variables

Key configuration options:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `SESSION_SECRET` | Session encryption key | Required |
| `OPENAI_API_KEY` | OpenAI API key | Optional |
| `LOG_LEVEL` | Logging level | `info` |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limiting | `100` |

### Resource Requirements

#### Minimum Resources

| Component | CPU Request | Memory Request | CPU Limit | Memory Limit |
|-----------|-------------|----------------|-----------|--------------|
| App Pod | 500m | 512Mi | 1000m | 1Gi |
| PostgreSQL | 500m | 512Mi | 1000m | 1Gi |
| Prometheus | 500m | 1Gi | 1000m | 2Gi |
| Grafana | 250m | 512Mi | 500m | 1Gi |

#### Recommended Production

| Component | CPU Request | Memory Request | CPU Limit | Memory Limit |
|-----------|-------------|----------------|-----------|--------------|
| App Pod | 1000m | 1Gi | 2000m | 2Gi |
| PostgreSQL | 1000m | 2Gi | 2000m | 4Gi |
| Prometheus | 1000m | 2Gi | 2000m | 4Gi |
| Grafana | 500m | 1Gi | 1000m | 2Gi |

### Scaling Configuration

- **Min Replicas**: 3 (production)
- **Max Replicas**: 20
- **Target CPU**: 70%
- **Target Memory**: 80%
- **Scale Down Stabilization**: 5 minutes
- **Scale Up Stabilization**: 1 minute

## 🔒 Security

### RBAC Configuration

The application runs with minimal RBAC permissions:

- Read access to ConfigMaps and Secrets
- Read access to own Pods
- No cluster-wide permissions

### Network Policies

Restricted network access:

- Ingress: Only from ingress controller and monitoring
- Egress: Only to database, DNS, and external APIs
- No pod-to-pod communication outside namespace

### Security Context

- Non-root user (UID 1001)
- Read-only root filesystem
- No privilege escalation
- Dropped capabilities

## 📊 Monitoring

### Prometheus Metrics

Key metrics collected:

- HTTP request rate and latency
- Database connection pool status
- Memory and CPU usage
- Custom application metrics

### Grafana Dashboards

Pre-configured dashboards:

- Application Overview
- Database Performance
- Infrastructure Metrics
- Alert Status

### Alerts

Configured alerts:

- High CPU/Memory usage
- Pod crash looping
- Database connection failures
- High error rates

## 🔄 Deployment Strategies

### Rolling Updates

Default strategy with:

- Max Surge: 1 pod
- Max Unavailable: 1 pod
- Health checks during rollout

### Blue-Green Deployment

For zero-downtime deployments:

```bash
# Deploy to staging
kubectl apply -k k8s/overlays/staging

# Validate staging
curl https://staging.academic-crm.example.com/health

# Switch production traffic
kubectl patch ingress academic-crm-ingress -p '{"spec":{"rules":[...]}}'
```

### Canary Deployment

Using traffic splitting:

```bash
# Deploy canary version
kubectl apply -k k8s/overlays/canary

# Gradually increase traffic
kubectl patch service academic-crm-service --type='merge' -p='{"spec":{"selector":{"version":"canary"}}}'
```

## 🗄️ Database Management

### PostgreSQL Setup

- Persistent storage with 10Gi minimum
- Automated backups (configure with your backup solution)
- Connection pooling via application

### Migrations

Database migrations run automatically via init container:

```bash
# Manual migration
kubectl exec -n academic-crm deployment/academic-crm-app -- npm run db:push
```

### Backup Strategy

Recommended backup approach:

```bash
# Create backup job
kubectl create job --from=cronjob/postgres-backup postgres-backup-manual

# Restore from backup
kubectl exec -n academic-crm postgres-0 -- psql -U postgres -d academic_crm < backup.sql
```

## 🐛 Troubleshooting

### Common Issues

#### Pods Not Starting

```bash
# Check pod status
kubectl describe pod -n academic-crm <pod-name>

# Check logs
kubectl logs -n academic-crm <pod-name> --previous
```

#### Database Connection Issues

```bash
# Test database connectivity
kubectl exec -n academic-crm deployment/academic-crm-app -- npm run db:test

# Check database logs
kubectl logs -n academic-crm deployment/postgres
```

#### Ingress Not Working

```bash
# Check ingress status
kubectl describe ingress -n academic-crm academic-crm-ingress

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

### Debug Commands

```bash
# Port forward to application
kubectl port-forward -n academic-crm svc/academic-crm-service 8080:80

# Port forward to database
kubectl port-forward -n academic-crm svc/postgres-service 5432:5432

# Shell into application pod
kubectl exec -it -n academic-crm deployment/academic-crm-app -- /bin/sh

# View all resources
kubectl get all -n academic-crm
```

## 📈 Performance Tuning

### Application Optimization

- Enable connection pooling
- Configure caching layers
- Optimize database queries
- Enable compression

### Kubernetes Optimization

- Resource requests/limits tuning
- Pod disruption budgets
- Node affinity rules
- Topology spread constraints

## 🔐 Security Hardening

### Pod Security Standards

Apply Pod Security Standards:

```bash
kubectl label namespace academic-crm pod-security.kubernetes.io/enforce=restricted
kubectl label namespace academic-crm pod-security.kubernetes.io/audit=restricted
kubectl label namespace academic-crm pod-security.kubernetes.io/warn=restricted
```

### Network Security

- Enable network policies
- Use encrypted connections
- Implement mTLS where possible
- Regular security scans

## 📚 Additional Resources

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Kustomize Documentation](https://kustomize.io/)
- [Prometheus Operator](https://prometheus-operator.dev/)
- [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/)

## 🤝 Contributing

When modifying Kubernetes manifests:

1. Test changes in development environment first
2. Update documentation for any new configurations
3. Follow security best practices
4. Validate with `kubectl apply --dry-run=client`

## 📞 Support

For deployment issues:

1. Check troubleshooting section above
2. Review logs and events
3. Consult monitoring dashboards
4. Create issue with deployment details