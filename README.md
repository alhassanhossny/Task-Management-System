# TASK - Hospital IT Task Management System

A bilingual (Arabic/English) enterprise task management system designed for hospital IT departments.

## Features

- **Multi-Language**: Full Arabic and English support with RTL/LTR switching
- **Task Management**: Complete task lifecycle with workflow management
- **Role-Based Access**: Admin and User roles with granular permissions
- **Comments**: Threaded comments with user mentions
- **Attachments**: File upload with drag & drop, clipboard paste support
- **Notifications**: In-app notifications for task events
- **Audit Logging**: Complete immutable audit trail
- **Dashboard**: User and Admin dashboards with statistics
- **Backup**: Database backup/restore and attachment export
- **Search & Filters**: Multi-criteria task filtering

## Tech Stack

### Backend
- NestJS (Node.js)
- TypeScript
- TypeORM (PostgreSQL)
- JWT Authentication
- bcrypt Password Hashing
- REST API

### Frontend
- React 18
- TypeScript
- Vite
- Material UI (MUI)
- i18next (Internationalization)
- React Router v6
- Axios

### Deployment
- Docker
- Docker Compose
- PostgreSQL 16
- Nginx

## Project Structure

```
task/
├── backend/                # NestJS Backend
│   ├── src/
│   │   ├── domain/         # Domain Layer - Entities
│   │   ├── application/    # Application Layer - DTOs, Services
│   │   ├── infrastructure/ # Infrastructure Layer - Database, Auth, Audit
│   │   └── presentation/   # Presentation Layer - Controllers, Guards, Modules
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # State management (Auth context)
│   │   ├── i18n/           # Translation files
│   │   └── theme/          # MUI theme configuration
│   ├── Dockerfile
│   └── package.json
├── docker/
│   └── postgres/           # PostgreSQL initialization scripts
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url> task
cd task
```

2. Start all services:
```bash
docker-compose up -d
```

3. Run database seed:
```bash
docker exec -it task-backend npm run seed
```

4. Access the application:
- Frontend: http://172.16.1.10
- Backend API: http://172.16.1.10:3000/api/v1

### Default Credentials

**Admin User:**
- Username: `admin`
- Password: `Admin@2024`

**Regular User:**
- Username: `user`
- Password: `User@2024`

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

- JWT-based authentication with refresh tokens
- bcrypt password hashing
- Role-based access control (RBAC)
- Input validation using class-validator
- Rate limiting on API endpoints
- SQL injection protection (TypeORM parameterized queries)
- File type validation for uploads
- XSS protection (React's built-in escaping)

## Multilingual Support

- Default language: Arabic (RTL)
- Runtime language switching
- Complete Arabic and English translations
- Arabic-compatible font (Cairo)
- RTL/LTR layout switching
- Date formatting per locale

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host | postgres |
| DB_PORT | Database port | 5432 |
| DB_USERNAME | Database user | task_admin |
| DB_PASSWORD | Database password | Task@Secure#2024 |
| DB_DATABASE | Database name | task_hospital |
| JWT_SECRET | JWT signing secret | (set in .env) |
| JWT_EXPIRATION | Access token expiry | 1h |
| JWT_REFRESH_SECRET | Refresh token secret | (set in .env) |
| JWT_REFRESH_EXPIRATION | Refresh token expiry | 7d |
| SERVER_PORT | Backend port | 3000 |
| UPLOAD_DIR | Upload directory | /app/uploads |
| BACKUP_DIR | Backup directory | /app/backups |
| CORS_ORIGIN | CORS allowed origin | http://172.16.1.10:5173 |
| DEFAULT_LANG | Default language | ar |

## Deployment

### Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build backend
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
# Serve dist/ with nginx or similar
```

## Browser Support

- Google Chrome (Windows 7 SP1 compatible)
- Microsoft Edge Legacy
- Modern browsers

## License

Private - Hospital Internal Use
