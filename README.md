# AguaPotable - Sistema de Gestión de Agua Potable

Sistema web multi-tenant para la gestión de agua potable en comunidades pequeñas.
Permite administrar suscriptores, medidores, lecturas mensuales, facturación escalonada,
cobros, alertas automáticas y reportes — todo de forma aislada por comunidad.

---

## Arquitectura General

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Navegador (Angular 17)                       │
│  Login → Dashboard → Suscriptores / Lecturas / Facturación / Pagos   │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ HTTP + JWT
┌──────────────────────▼───────────────────────────────────────────────┐
│               NestJS 10  (Puerto 8081)                                │
│   Auth Guard → Controller → Service → Repository (TypeORM)           │
│   Scheduled tasks (@Cron)  |  Swagger → /swagger-ui.html             │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ TypeORM
┌──────────────────────▼───────────────────────────────────────────────┐
│             PostgreSQL 16  (Puerto 5433 en dev, 5432 en prod)         │
│   Schema: comunidades, usuarios, suscriptores, medidores, lecturas    │
│            facturas, pagos, tarifas, tarifa_rangos, alertas           │
└──────────────────────────────────────────────────────────────────────┘
```

### Multi-tenancy

Cada **Comunidad** es un tenant independiente.  
El `comunidad_id` se incrusta en el JWT al hacer login y se propaga
automáticamente a cada consulta mediante `JwtAuthFilter`.  
Un usuario `SUPER_ADMIN` puede operar entre comunidades.

---

## Módulos del sistema

| Módulo | Descripción |
|---|---|
| **Autenticación** | Login con JWT, roles por comunidad |
| **Dashboard** | KPIs: suscriptores, facturado, cobrado, morosidad + alertas |
| **Suscriptores** | Alta/baja, búsqueda, ficha con medidores y facturas |
| **Medidores** | Registro de medidores asociados a suscriptores |
| **Lecturas** | Registro mensual, cálculo de consumo m³ en tiempo real |
| **Facturación** | Generación individual o masiva, tarifas escalonadas |
| **Pagos** | Registro de cobros, múltiples métodos de pago |
| **Tarifas** | Configuración de rangos escalonados por tipo de suscriptor |
| **Reportes** | Morosidad detallada + recaudación mensual 12 meses |
| **Configuración** | Datos de la comunidad, usuarios, numeración de documentos |

### Roles disponibles

| Rol | Acceso |
|---|---|
| `SUPER_ADMIN` | Todas las comunidades + configuración global |
| `ADMIN` | Gestión completa de su comunidad |
| `OPERADOR` | Lecturas, suscriptores, medidores |
| `CAJERO` | Registro de pagos, vista de facturas |
| `CONSULTA` | Solo lectura |

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| PostgreSQL | 16+ |
| Docker + Compose | 24+ (para dev: solo BD) |

---

## Inicio rápido (desarrollo)

```bash
# Clonar / acceder al directorio del proyecto
cd AguaPotable

# Levantar solo PostgreSQL en Docker
docker compose -f docker-compose.dev.yml up -d postgres

# Esperar 5-10s a que PostgreSQL esté listo
# Instalar dependencias
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Terminal 1: Iniciar backend NestJS (watch mode)
cd backend
DB_HOST=localhost DB_PORT=5433 DB_USER=postgres DB_PASS=postgres \
  JWT_SECRET="dev-secret-key-para-desarrollo-local-32chars!!" \
  npm run start:dev

# Terminal 2: Iniciar frontend Angular
cd frontend
npm start

# Acceder a:
#   Frontend:  http://localhost:4200
#   Backend:   http://localhost:8081
#   Swagger:   http://localhost:8081/swagger-ui.html
#   pgAdmin:   http://localhost:5050 (admin@local.dev / admin123)
```

**O usar el script automatizado:**
```bash
./start-dev.sh                  # Levanta todo
./start-dev.sh --no-frontend    # Solo backend y DB
./start-dev.sh --stop           # Detiene todo
```

---

## Desarrollo en detalle

### Base de datos (Docker)

```bash
# Levantar solo PostgreSQL (dev)
docker compose -f docker-compose.dev.yml up -d postgres

# Esperar a que esté listo (healthcheck automático)
# Verificar:
docker ps --filter name=aguapotable-dev-db
```

### Backend (NestJS)

```bash
cd backend
npm install

# Variables de entorno requeridas:
export DB_HOST=localhost
export DB_PORT=5433
export DB_USER=postgres
export DB_PASS=postgres
export DB_NAME=agua_potable
export JWT_SECRET="dev-secret-key-para-desarrollo-local-32chars!!"
export NODE_ENV=development
export PORT=8081

# Modo desarrollo (watch + hot reload)
npm run start:dev

# Modo compilado
npm run build
node dist/main
```

TypeORM ejecutará automáticamente las migraciones en `db/migration/` 
al arrancar por primera vez.

### Frontend (Angular)

```bash
cd frontend
npm install

# Desarrollo (con proxy a http://localhost:8081)
npm start                  # equiv: ng serve --port 4200 --proxy-config proxy.conf.json

# Producción
npm run build
```

El proxy en `proxy.conf.json` redirige `/api` a `http://localhost:8081`.

---

## Credenciales de prueba (seed)

| Campo | Valor |
|---|---|
| Email | `admin@sistema.com` |
| Contraseña | `Admin123!` |
| Rol | `SUPER_ADMIN` |
| Comunidad | Comunidad Demo |

> Cambiar la contraseña en producción.

---

## Variables de entorno del backend

| Variable | Descripción | Defecto (dev) |
|---|---|---|
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Puerto PostgreSQL | `5433` (dev) / `5432` (prod) |
| `DB_NAME` | Nombre de la DB | `agua_potable` |
| `DB_USER` | Usuario PostgreSQL | `postgres` |
| `DB_PASS` | Contraseña PostgreSQL | `postgres` |
| `JWT_SECRET` | Clave HMAC-SHA256 (≥32 chars) | `dev-secret-key-para-desarrollo-local-32chars!!` |
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Puerto de NestJS | `8081` |

---

## API REST

La documentación interactiva está disponible en:

```
http://localhost:8081/swagger-ui.html
```

Endpoints principales (v1 en `/api/v1`):

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Obtener JWT |
| `GET` | `/api/v1/suscriptores` | Listar suscriptores (paginado) |
| `POST` | `/api/v1/suscriptores` | Crear suscriptor |
| `GET` | `/api/v1/medidores` | Listar medidores |
| `POST` | `/api/v1/lecturas` | Registrar lectura mensual |
| `POST` | `/api/v1/facturacion/generar/:lecturaId` | Generar factura individual |
| `POST` | `/api/v1/facturacion/generar-masivo` | Facturación masiva por período |
| `POST` | `/api/v1/pagos` | Registrar pago |
| `GET` | `/api/v1/reportes/dashboard` | KPIs del dashboard |
| `GET` | `/api/v1/reportes/morosidad` | Reporte de cuentas morosas |
| `GET` | `/api/v1/reportes/recaudacion-mensual` | Recaudación últimos 12 meses |

---

## Estructura del proyecto

```
AguaPotable/
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── src/
│       ├── main.ts              # Bootstrap NestJS
│       ├── app.module.ts        # Root Module + TypeORM
│       ├── auth/                # JWT estrategy + guards
│       ├── comunidad/           # Módulo + entity + service
│       ├── suscriptor/          # CRUD suscriptores
│       ├── medidor/             # CRUD medidores
│       ├── lectura/             # Lecturas mensuales
│       ├── facturacion/         # Generación de facturas
│       ├── pago/                # Registro de pagos
│       ├── tarifa/              # Configuración de tarifas
│       ├── reporte/             # Dashboard + morosidad
│       ├── alerta/              # Alertas automáticas (@Cron)
│       ├── common/              # Filters, guards, decorators
│       └── db/migration/        # TypeORM migrations
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── src/app/
│   │   ├── core/               # Modelos, servicios, guards, interceptor
│   │   ├── modules/
│   │   │   ├── auth/           # Login
│   │   │   ├── layout/         # Sidenav + toolbar
│   │   │   ├── dashboard/
│   │   │   ├── suscriptores/
│   │   │   ├── medidores/
│   │   │   ├── lecturas/
│   │   │   ├── facturacion/
│   │   │   ├── pagos/
│   │   │   ├── reportes/
│   │   │   ├── tarifas/
│   │   │   └── configuracion/
│   │   └── shared/             # ForbiddenComponent
│   └── package.json
├── docker-compose.yml           # Producción: Backend + Frontend + DB
├── docker-compose.dev.yml       # Desarrollo: Solo DB
├── .env.dev                     # Variables para dev
├── start-dev.sh                 # Script automatizado
└── README.md
```

---

## Pendientes / TODOs

- [ ] Controlador y servicio REST para **Medidores** (backend)
- [ ] Controlador y servicio REST para **Tarifas** (backend)
- [ ] Controlador y servicio REST para **Alertas** (backend)
- [ ] Módulo de **gestión de usuarios** en Configuración (frontend)
- [ ] Gráficos de **Recaudación mensual** con Chart.js (frontend)
- [ ] **Numeración automática** de documentos por comunidad (frontend)
- [ ] Lista y detalle de Medidores en `MedidoresListComponent` (frontend)
- [ ] Tests unitarios (backend: JUnit 5 + Mockito)
- [ ] Tests e2e (frontend: Cypress o Playwright)
- [ ] CI/CD con GitHub Actions

---

## Tecnologías utilizadas

**Backend**
- NestJS 10 · TypeScript · TypeORM
- Passport.js + JWT · @nestjs/schedule (@Cron para alertas)
- Swagger/OpenAPI · PostgreSQL 16
- class-validator, class-transformer · bcryptjs

**Frontend**
- Angular 17 · TypeScript · RxJS 7.8
- Angular Material 17 (Indigo/Pink theme)
- Chart.js + ng2-charts (gráficos)
- Lazy loading por módulo · Auth guards + JWT interceptor

---

## Licencia

Uso interno — L-Soft. Adaptable libremente para cualquier comunidad.
