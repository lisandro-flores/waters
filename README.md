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
│               Spring Boot 3.2  (Puerto 8080)                          │
│   Security → JwtAuthFilter → Controller → Service → Repository       │
│   Scheduled alerts (@Scheduled)  |  OpenAPI → /swagger-ui.html       │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ JPA / Flyway
┌──────────────────────▼───────────────────────────────────────────────┐
│             PostgreSQL 16  (Puerto 5432)                               │
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
| Java (JDK) | 17 |
| Maven | 3.9+ |
| Node.js | 18+ |
| Angular CLI | 17 |
| PostgreSQL | 15+ |
| Docker + Compose | 24+ (opcional) |

---

## Inicio rápido con Docker

```bash
# Clonar / acceder al directorio del proyecto
cd AguaPotable

# Levantar toda la pila (DB + Backend + Frontend)
docker compose up --build

# Acceder a:
#   Frontend:  http://localhost:4200
#   Backend:   http://localhost:8080
#   Swagger:   http://localhost:8080/swagger-ui.html
```

> El primer arranque puede tardar varios minutos mientras se construyen las imágenes.

---

## Inicio manual (desarrollo)

### 1. Base de datos

```bash
# Crear la base de datos en PostgreSQL local
psql -U postgres -c "CREATE DATABASE agua_potable;"
```

### 2. Backend

```bash
cd backend

# Configurar variables de entorno (o editar application.yml)
export DB_USER=postgres
export DB_PASS=postgres
export JWT_SECRET="super-secret-key-para-produccion-minimo-32-chars!!"

# Compilar y ejecutar
mvn spring-boot:run
```

Flyway ejecutará automáticamente `V1__init_schema.sql` y `V2__seed_data.sql`
al arrancar por primera vez.

### 3. Frontend

```bash
cd frontend
npm install
ng serve          # http://localhost:4200
```

El proxy en `proxy.conf.json` redirige `/api` a `localhost:8080`.

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
| `SPRING_DATASOURCE_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://localhost:5432/agua_potable` |
| `DB_USER` | Usuario PostgreSQL | `postgres` |
| `DB_PASS` | Contraseña PostgreSQL | `postgres` |
| `JWT_SECRET` | Clave HMAC-SHA256 (≥32 chars) | (ver application.yml) |

---

## API REST

La documentación interactiva está disponible en:

```
http://localhost:8080/swagger-ui.html
```

Endpoints principales:

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/v1/auth/login` | Obtener JWT |
| `GET` | `/api/v1/suscriptores` | Listar suscriptores (paginado) |
| `POST` | `/api/v1/lecturas` | Registrar lectura mensual |
| `POST` | `/api/v1/facturacion/generar` | Generar factura individual |
| `POST` | `/api/v1/facturacion/generar-masivo` | Facturación masiva por período |
| `GET` | `/api/v1/reportes/dashboard` | KPIs del dashboard |
| `GET` | `/api/v1/reportes/morosidad` | Reporte de cuentas morosas |

---

## Estructura del proyecto

```
AguaPotable/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/lsoft/aguapotable/
│       │   ├── config/          # SecurityConfig
│       │   ├── domain/
│       │   │   ├── entity/      # 9 entidades JPA
│       │   │   ├── enums/       # 8 enumeraciones
│       │   │   └── repository/  # 9 repositorios
│       │   ├── dto/             # DTOs de request/response
│       │   ├── exception/       # GlobalExceptionHandler
│       │   ├── security/        # JWT + filtros
│       │   └── service/         # Lógica de negocio
│       └── resources/
│           ├── application.yml
│           └── db/migration/    # V1 schema + V2 seed
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
└── docker-compose.yml
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
- Spring Boot 3.2.3 · Spring Security · Spring Data JPA
- JWT (jjwt 0.12.5) · Flyway · MapStruct · Lombok
- SpringDoc OpenAPI 2 · PostgreSQL 16

**Frontend**
- Angular 17 · Angular Material 17 (Indigo/Pink)
- RxJS 7.8 · Chart.js + ng2-charts
- Lazy loading por módulo · Angular Router guards

---

## Licencia

Uso interno — L-Soft. Adaptable libremente para cualquier comunidad.
