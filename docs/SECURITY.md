# PAIMANA Sentinel AI — Security Architecture

## 1. Authentication & Session Security
- **JWT Standard**: Short-lived Access Tokens (24h) and long-lived Refresh Tokens (7d).
- **Password Hashing**: Cryptographically secure bcrypt hashing with cost factor 12.
- **Role-Based Access Control (RBAC)**: Fine-grained permission decorators enforced at both FastAPI router level and database query scope.

## 2. Protection Mechanisms
- **Input Validation**: Strict schema enforcement using Pydantic V2 prevents SQL injection and buffer overflow vectors.
- **CORS Protection**: Whitelisted origin headers.
- **Zero Sensitive Logging**: Password hashes and private tokens are masked from console and Prometheus metrics.
- **Audit Trails**: Every alert acknowledgment, resolution, and administrative change is permanently recorded with timestamps.
