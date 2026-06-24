# TASK - Hospital IT Task Management System

A bilingual (Arabic/English) enterprise task management system designed for hospital IT departments. Deployed on an offline domain network at `task.darh.com`.

## Features

- **Multi-Language**: Full Arabic and English support with RTL/LTR switching
- **Task Management**: Complete task lifecycle (assigned → completed → cancelled)
- **Role-Based Access**: Admin and User roles with department-scoped permissions
- **Comments**: Threaded comments with user mentions
- **Attachments**: File upload with drag & drop, clipboard paste support
- **Notifications**: In-app notifications for task events
- **Audit Logging**: Complete immutable audit trail
- **Dashboard**: Stats cards, tasks-by-department, recharts bar charts
- **Backup**: Database backup/restore and attachment export
- **Search & Date Filters**: Keyword search, status filter, date range filtering

## Requirements

### System Requirements
- **OS**: Linux (Ubuntu 22.04+ / Debian 12+)
- **CPU**: 2 cores minimum
- **RAM**: 4 GB minimum
- **Disk**: 20 GB minimum (SSD recommended)
- **Network**: Static IP on hospital network (172.16.x.x range)

### Software Prerequisites
- Docker Engine 24+
- Docker Compose V2
- Git
- OpenSSL (for certificate management)

### Windows 7 Client Requirements
- Google Chrome (last version supporting Windows 7)
- Microsoft Edge Legacy
- Network access to `https://task.darh.com`

## Components

### Backend (`backend/`)
| Component | Technology | Description |
|-----------|-----------|-------------|
| API Framework | NestJS | Modular Node.js backend with controller/service/repository pattern |
| Language | TypeScript | Type-safe runtime |
| ORM | TypeORM | PostgreSQL object-relational mapping |
| Authentication | JWT + bcrypt | Access + refresh token pair, salted password hashing |
| Validation | class-validator | DTO-based input validation with decorators |
| Audit | Custom interceptor | Automatic immutable audit logging on all CRUD operations |
| File Upload | multer + sharp | Attachment upload with image resizing |
| Database | PostgreSQL 16 | Relational data store |

### Frontend (`frontend/`)
| Component | Technology | Description |
|-----------|-----------|-------------|
| UI Framework | React 18 | Component-based SPA |
| Build Tool | Vite | Fast dev server and optimized production builds |
| UI Library | Material UI 5 | Pre-built components with RTL support |
| State Management | React Context | Auth state, language preference |
| Routing | React Router v6 | Nested route layout with protected/private routes |
| i18n | i18next + react-i18next | Runtime language switching with JSON translation files |
| HTTP Client | Axios | API communication with interceptors for auth tokens |
| Charts | Recharts | Bar charts for dashboard analytics |
| Notifications | react-toastify | Toast notifications for user feedback |

### Infrastructure
| Component | Technology | Description |
|-----------|-----------|-------------|
| Container Runtime | Docker + Compose | Multi-service orchestration |
| Reverse Proxy | Nginx (in frontend container) | Serves built SPA assets |
| Database | PostgreSQL 16 Alpine | Lightweight database container |
| SSL Termination | Nginx (host) | Proxies HTTPS → container HTTP |
| Internal CA | DarElteb Local CA | Self-signed CA for internal `.darh.com` certificates |

## Project Structure

```
task/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── domain/entities/    # TypeORM entity definitions
│   │   ├── application/
│   │   │   ├── dtos/           # Request/response validation DTOs
│   │   │   └── services/       # Business logic services
│   │   ├── infrastructure/     # Database, auth strategies, audit
│   │   └── presentation/
│   │       ├── controllers/    # REST API controllers
│   │       ├── guards/         # Auth & role guards
│   │       └── modules/        # NestJS module definitions
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page-level components
│   │   │   ├── DashboardPage   # Stats + charts
│   │   │   ├── TasksPage       # Task list + filters
│   │   │   ├── TaskDetailPage  # Detail + status actions
│   │   │   ├── TaskFormPage    # Create/edit form
│   │   │   ├── LoginPage       # Authentication
│   │   │   ├── UsersPage       # User CRUD (admin)
│   │   │   ├── DepartmentsPage # Department CRUD (admin)
│   │   │   ├── SettingsPage    # Key-value settings (admin)
│   │   │   ├── TaskTitlesPage  # Task title templates (admin)
│   │   │   ├── AuditPage       # Audit log viewer (admin)
│   │   │   └── NotificationsPage # User notifications
│   │   ├── services/           # Axios API service layer
│   │   ├── store/              # Auth context provider
│   │   ├── hooks/              # Custom hooks (useDirection)
│   │   ├── i18n/               # Translation files (en/ar)
│   │   ├── theme/              # MUI theme (RTL-aware)
│   │   └── layouts/            # MainLayout, AuthLayout
│   ├── Dockerfile
│   └── package.json
├── docker/
│   └── postgres/               # DB init scripts + seed data
├── TASK-Launcher/              # Windows launcher application
├── docker-compose.yml
└── README.md
```

## Installation

### 1. Clone & Configure
```bash
git clone <repository-url> /opt/projects/task
cd /opt/projects/task
```

### 2. Environment Variables
Edit `docker-compose.yml` to match your environment:
```yaml
environment:
  DB_PASSWORD: <your-secure-password>
  JWT_SECRET: <your-jwt-secret>
  JWT_REFRESH_SECRET: <your-refresh-secret>
  CORS_ORIGIN: http://<your-ip>:8080,https://<your-domain>
  DEFAULT_LANG: ar    # or en
```

### 3. Start Services
```bash
docker compose up -d
```

This starts three containers:
- `task-postgres` — PostgreSQL 16 on port 5433
- `task-backend` — NestJS API on port 3001
- `task-frontend` — React SPA (Nginx) on port 8080

### 4. Initialize Database
```bash
docker compose exec backend npm run seed
```

### 5. SSL (Production)
The host nginx must proxy HTTPS → container HTTP:
```nginx
server {
    listen 443 ssl;
    server_name task.darh.com;

    ssl_certificate /etc/ssl/certs/darh-chain.crt;
    ssl_certificate_key /etc/ssl/private/darh-server.key;

    location / {
        proxy_pass http://172.16.1.10:8080;
    }
}
```

### 6. DNS
Add to your domain DNS (or `/etc/hosts`):
```
172.16.1.10 task.darh.com
```

### Default Credentials

**Admin User:**
- Username: `admin`
- Password: `123`

**Regular User:**
- Username: `user`
- Password: `123`

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh token |
| POST | `/api/v1/auth/logout` | Logout |
| GET | `/api/v1/auth/profile` | Get profile |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks` | List tasks (with filters) |
| POST | `/api/v1/tasks` | Create task |
| GET | `/api/v1/tasks/dashboard` | Dashboard stats |
| GET | `/api/v1/tasks/my` | My tasks |
| GET | `/api/v1/tasks/:id` | Get task detail |
| PUT | `/api/v1/tasks/:id` | Update task |
| PUT | `/api/v1/tasks/:id/status` | Change status |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks/:taskId/comments` | List comments |
| POST | `/api/v1/tasks/:taskId/comments` | Add comment |

### Attachments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/tasks/:taskId/attachments` | List attachments |
| POST | `/api/v1/tasks/:taskId/attachments` | Upload files |
| GET | `/api/v1/tasks/:taskId/attachments/:id/download` | Download file |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List users |
| POST | `/api/v1/users` | Create user |

### Departments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/departments` | List departments |
| GET | `/api/v1/departments/active` | List active departments |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/notifications` | List notifications |
| GET | `/api/v1/notifications/unread-count` | Unread count |
| PUT | `/api/v1/notifications/:id/read` | Mark as read |
| PUT | `/api/v1/notifications/read-all` | Mark all as read |

### Audit Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/audit` | List audit logs |
| GET | `/api/v1/audit/entity/:entity/:entityId` | Logs by entity |

### Backup
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/backup/export` | Export database |
| POST | `/api/v1/backup/export-attachments` | Export attachments |
| GET | `/api/v1/backup/list` | List backups |

## Task Workflow

```
Draft → New → Assigned → In Progress → Waiting for Response
                                    ↓
                              Completed → Closed
                                      
Cancelled can occur from: Draft, New, Assigned
```

## Data Flow

1. User creates a task (Draft status)
2. Task moves to New
3. Admin/Manager assigns the task
4. Assigned user starts working (In Progress)
5. If clarification needed: Waiting for Response → In Progress
6. Task completed → Closed

## Security

### Authentication & Authorization
- **JWT tokens**: Short-lived access tokens (1h) + long-lived refresh tokens (7d)
- **bcrypt hashing**: All passwords salted with 10 rounds before storage
- **Role-based access**: Admin-only routes protected by `AdminRoute` guard; user data scoped to department
- **Session management**: Tokens invalidated on logout; refresh rotation

### API Security
- **Input validation**: All DTOs validated via `class-validator` decorators
- **SQL injection**: Prevented by TypeORM parameterized queries
- **CORS**: Restricted to known origins (IP and domain whitelist)
- **File upload**: Type validation, size limits enforced on upload endpoints

### Frontend Security
- **XSS protection**: React's built-in JSX escaping
- **Client-side routing**: PrivateRoute / AdminRoute wrappers prevent unauthorized page access
- **Secure HTTP-only cookies** not used (JWT stored in memory)

### Network Security
- **Internal-only deployment**: Runs on hospital network (172.16.x.x), not exposed to internet
- **HTTPS**: SSL termination at host nginx using internal CA certificates
- **Docker isolation**: Each service runs in its own container with bridge network

### Recommended Hardening
- Change default passwords immediately after first login
- Rotate JWT secrets and DB passwords periodically
- Restrict Docker socket access to root only
- Enable audit log retention policies
- Use firewall rules to limit access to ports 8080/3001/5433

## Multilingual Support

- Default language: Arabic (RTL)
- Runtime language switching
- Complete Arabic and English translations
- Arabic-compatible font (Cairo)
- RTL/LTR layout switching (flex direction, drawer anchor, text alignment)
- Date/time formatting per locale (`ar-SA` / `en-GB`)
- Flip-aware icon rotation for RTL

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | postgres |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database user | task_admin |
| DB_PASSWORD | Database password | Task@Secure#2024 |
| DB_DATABASE | Database name | task_hospital |
| JWT_SECRET | JWT signing secret | (set in docker-compose.yml) |
| JWT_REFRESH_SECRET | Refresh token secret | (set in docker-compose.yml) |
| SERVER_PORT | Backend port | 3000 |
| UPLOAD_DIR | Upload directory | /app/uploads |
| BACKUP_DIR | Backup directory | /app/backups |
| CORS_ORIGIN | Comma-separated CORS origins | http://172.16.1.10:8080 |
| DEFAULT_LANG | Default language (ar/en) | ar |

## Deployment

### Docker Compose

```bash
# Build and start all services
docker compose up -d

# Rebuild and restart a specific service
docker compose build frontend && docker compose up -d frontend

# View logs
docker compose logs -f

# Stop and remove containers
docker compose down
```

### Rebuild After Code Changes

```bash
# Frontend only
docker compose build frontend && docker compose up -d frontend

# Backend only  
docker compose build backend && docker compose up -d backend

# Everything
docker compose up -d --build
```

### Database

```bash
# Access PostgreSQL CLI
docker compose exec postgres psql -U task_admin -d task_hospital

# Run seed script
docker compose exec backend npm run seed

# Backup database
docker compose exec postgres pg_dump -U task_admin task_hospital > backup.sql
```

### Manual Deployment

**Backend:**
```bash
cd backend
npm install
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# Serve dist/ with nginx
```

## Browser Support

- Google Chrome (Windows 7 SP1 compatible)
- Microsoft Edge Legacy
- Modern browsers

## License

Private - Hospital Internal Use
