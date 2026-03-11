#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  start-dev.sh  — Inicia el entorno de desarrollo completo
#  Uso: ./start-dev.sh [--no-frontend] [--no-backend] [--stop]
# ─────────────────────────────────────────────────────────────────────────────
set -e

# ── Colores ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${CYAN}[DEV]${NC} $*"; }
ok()   { echo -e "${GREEN}[OK]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()  { echo -e "${RED}[ERR]${NC} $*"; }

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

START_FRONTEND=true
START_BACKEND=true

# ── Args ──────────────────────────────────────────────────────────────────────
for arg in "$@"; do
  case $arg in
    --no-frontend) START_FRONTEND=false ;;
    --no-backend)  START_BACKEND=false ;;
    --stop)
      log "Deteniendo servicios..."
      docker compose -f "$ROOT_DIR/docker-compose.dev.yml" down
      pkill -f "spring-boot:run" 2>/dev/null || true
      pkill -f "ng serve" 2>/dev/null || true
      ok "Servicios detenidos."
      exit 0
      ;;
  esac
done

# ── 1. Verificar Java ─────────────────────────────────────────────────────────
log "Verificando Java..."
if ! command -v java &>/dev/null; then
  err "Java no encontrado. Instalar JDK 21: sudo apt install openjdk-21-jdk"
  exit 1
fi
JAVA_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
ok "Java $JAVA_VER detectado ($(java -version 2>&1 | head -1))"

# ── 2. Verificar/instalar Maven ───────────────────────────────────────────────
if ! command -v mvn &>/dev/null; then
  warn "Maven no encontrado. Instalando via apt..."
  sudo apt-get update -qq && sudo apt-get install -y maven -qq
  ok "Maven instalado: $(mvn --version | head -1)"
else
  ok "Maven: $(mvn --version | head -1)"
fi

# Generar Maven wrapper si no existe
if [ ! -f "$BACKEND_DIR/mvnw" ]; then
  log "Generando Maven wrapper..."
  cd "$BACKEND_DIR" && mvn -N wrapper:wrapper -q
  ok "Maven wrapper generado."
  cd "$ROOT_DIR"
fi

# ── 3. Verificar Node / npm ───────────────────────────────────────────────────
log "Verificando Node.js..."
if ! command -v node &>/dev/null; then
  err "Node.js no encontrado. Instalar Node 20+: https://nodejs.org"
  exit 1
fi
ok "Node $(node --version) / npm $(npm --version)"

# ── 4. Verificar Angular CLI ──────────────────────────────────────────────────
if ! command -v ng &>/dev/null; then
  warn "Angular CLI no encontrado. Instalando globalmente..."
  npm install -g @angular/cli@17 --silent
  ok "Angular CLI instalado: $(ng version 2>/dev/null | grep 'Angular CLI' | head -1)"
fi

# ── 5. Verificar Docker ───────────────────────────────────────────────────────
log "Verificando Docker..."
if ! command -v docker &>/dev/null; then
  err "Docker no encontrado. Instalar Docker Desktop o Docker Engine."
  exit 1
fi
ok "Docker $(docker --version)"

# ── 6. Levantar PostgreSQL con Docker Compose ─────────────────────────────────
log "Levantando PostgreSQL (docker compose.dev.yml)..."
docker compose -f "$ROOT_DIR/docker-compose.dev.yml" up -d postgres
ok "PostgreSQL iniciando..."

# ── 7. Esperar a que PostgreSQL esté listo ────────────────────────────────────
log "Esperando a que PostgreSQL esté disponible..."
RETRIES=20
until docker exec aguapotable-dev-db pg_isready -U postgres -q 2>/dev/null; do
  RETRIES=$((RETRIES - 1))
  if [ $RETRIES -le 0 ]; then
    err "PostgreSQL no respondió en tiempo. Revisar: docker logs aguapotable-dev-db"
    exit 1
  fi
  sleep 2
  echo -n "."
done
echo ""
ok "PostgreSQL listo en localhost:5432"

# ── 8. Instalar dependencias del frontend ────────────────────────────────────
if [ "$START_FRONTEND" = true ] && [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  log "Instalando dependencias npm del frontend..."
  cd "$FRONTEND_DIR" && npm install --silent
  ok "Dependencias del frontend instaladas."
  cd "$ROOT_DIR"
fi

# ── 9. Iniciar backend ────────────────────────────────────────────────────────
if [ "$START_BACKEND" = true ]; then
  log "Iniciando backend Spring Boot (perfil: dev)..."
  cd "$BACKEND_DIR"
  SPRING_PROFILES_ACTIVE=dev \
  DB_USER=postgres \
  DB_PASS=postgres \
  JWT_SECRET="dev-secret-key-para-desarrollo-local-32chars!!" \
  SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5433/agua_potable" \
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &
  BACKEND_PID=$!
  echo "$BACKEND_PID" > /tmp/aguapotable-backend.pid
  ok "Backend iniciado (PID $BACKEND_PID)"
  log "  → API:     http://localhost:8081/api/v1"
  log "  → Swagger: http://localhost:8081/swagger-ui.html"
  cd "$ROOT_DIR"
fi

# ── 10. Iniciar frontend ──────────────────────────────────────────────────────
if [ "$START_FRONTEND" = true ]; then
  log "Esperando que el backend levante (healthcheck)..."
  RETRIES=40
  until curl -sf http://localhost:8081/actuator/health &>/dev/null; do
    RETRIES=$((RETRIES - 1))
    if [ $RETRIES -le 0 ]; then
      warn "Backend tardó más de lo esperado. Iniciando frontend de todas formas..."
      break
    fi
    sleep 3
    echo -n "."
  done
  echo ""

  log "Iniciando frontend Angular..."
  cd "$FRONTEND_DIR"
  npm start &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" > /tmp/aguapotable-frontend.pid
  ok "Frontend iniciado (PID $FRONTEND_PID)"
  log "  → App: http://localhost:4200"
  cd "$ROOT_DIR"
fi

echo ""
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ✔  Entorno de desarrollo listo               ${NC}"
echo -e "${GREEN}══════════════════════════════════════════════${NC}"
echo ""
log "URLs:"
echo "   Frontend  → http://localhost:4200"
echo "   Backend   → http://localhost:8081"
echo "   Swagger   → http://localhost:8081/swagger-ui.html"
echo "   pgAdmin   → http://localhost:5050  (admin@local.dev / admin123)"
echo ""
log "Para detener: ./start-dev.sh --stop"
echo ""

# Esperar a que los procesos terminen (Ctrl+C)
wait
