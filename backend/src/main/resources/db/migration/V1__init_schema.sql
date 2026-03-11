-- V1__init_schema.sql
-- Script de inicialización del esquema de base de datos

CREATE TABLE IF NOT EXISTS comunidades (
    id               BIGSERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL UNIQUE,
    direccion        VARCHAR(200),
    telefono         VARCHAR(20),
    email            VARCHAR(100),
    ruc              VARCHAR(20),
    provincia        VARCHAR(80),
    municipio        VARCHAR(80),
    activo           BOOLEAN      NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMP    NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usuarios (
    id               BIGSERIAL PRIMARY KEY,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    email            VARCHAR(150) NOT NULL,
    password         VARCHAR(255) NOT NULL,
    rol              VARCHAR(20)  NOT NULL,
    telefono         VARCHAR(20),
    activo           BOOLEAN      NOT NULL DEFAULT TRUE,
    comunidad_id     BIGINT       NOT NULL REFERENCES comunidades(id),
    creado_en        TIMESTAMP    NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (email, comunidad_id)
);

CREATE TABLE IF NOT EXISTS suscriptores (
    id               BIGSERIAL PRIMARY KEY,
    numero_cuenta    VARCHAR(20)  NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    apellido         VARCHAR(100) NOT NULL,
    identificacion   VARCHAR(20),
    direccion        VARCHAR(200),
    telefono         VARCHAR(20),
    email            VARCHAR(150),
    tipo             VARCHAR(20)  NOT NULL DEFAULT 'DOMICILIAR',
    estado           VARCHAR(20)  NOT NULL DEFAULT 'ACTIVO',
    fecha_ingreso    DATE,
    comunidad_id     BIGINT       NOT NULL REFERENCES comunidades(id),
    creado_en        TIMESTAMP    NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medidores (
    id                  BIGSERIAL PRIMARY KEY,
    numero_serie        VARCHAR(50) NOT NULL UNIQUE,
    marca               VARCHAR(80),
    diametro            VARCHAR(10),
    lectura_inicial     DOUBLE PRECISION NOT NULL DEFAULT 0,
    estado              VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    fecha_instalacion   DATE,
    fecha_baja          DATE,
    suscriptor_id       BIGINT NOT NULL REFERENCES suscriptores(id),
    creado_en           TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarifas (
    id                  BIGSERIAL PRIMARY KEY,
    nombre              VARCHAR(100) NOT NULL,
    comunidad_id        BIGINT NOT NULL REFERENCES comunidades(id),
    tipo_suscriptor     VARCHAR(20) NOT NULL,
    cuota_fija          NUMERIC(10,2) NOT NULL,
    porcentaje_mora     NUMERIC(5,4) NOT NULL DEFAULT 0.0200,
    dias_gracia         INTEGER NOT NULL DEFAULT 15,
    vigencia_desde      DATE,
    vigencia_hasta      DATE,
    activo              BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarifa_rangos (
    id              BIGSERIAL PRIMARY KEY,
    tarifa_id       BIGINT NOT NULL REFERENCES tarifas(id),
    rango_desde     DOUBLE PRECISION NOT NULL,
    rango_hasta     DOUBLE PRECISION,
    precio_por_m3   NUMERIC(10,4) NOT NULL
);

CREATE TABLE IF NOT EXISTS lecturas (
    id               BIGSERIAL PRIMARY KEY,
    medidor_id       BIGINT NOT NULL REFERENCES medidores(id),
    anio             INTEGER NOT NULL,
    mes              INTEGER NOT NULL,
    lectura_anterior DOUBLE PRECISION NOT NULL,
    lectura_actual   DOUBLE PRECISION NOT NULL,
    consumo_m3       DOUBLE PRECISION NOT NULL,
    fecha_lectura    DATE,
    lector_id        BIGINT REFERENCES usuarios(id),
    observaciones    TEXT,
    estimada         BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en        TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (medidor_id, anio, mes)
);

CREATE TABLE IF NOT EXISTS facturas (
    id               BIGSERIAL PRIMARY KEY,
    numero_factura   VARCHAR(20) NOT NULL,
    suscriptor_id    BIGINT NOT NULL REFERENCES suscriptores(id),
    lectura_id       BIGINT NOT NULL REFERENCES lecturas(id),
    tarifa_id        BIGINT NOT NULL REFERENCES tarifas(id),
    anio             INTEGER NOT NULL,
    mes              INTEGER NOT NULL,
    consumo_m3       DOUBLE PRECISION NOT NULL,
    monto_base       NUMERIC(10,2) NOT NULL,
    monto_consumo    NUMERIC(10,2) NOT NULL,
    otros_cargos     NUMERIC(10,2) NOT NULL DEFAULT 0,
    descuentos       NUMERIC(10,2) NOT NULL DEFAULT 0,
    mora             NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_pagar      NUMERIC(10,2) NOT NULL,
    fecha_emision    DATE,
    fecha_vencimiento DATE,
    estado           VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    creado_en        TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pagos (
    id             BIGSERIAL PRIMARY KEY,
    factura_id     BIGINT NOT NULL REFERENCES facturas(id),
    monto          NUMERIC(10,2) NOT NULL,
    fecha_pago     DATE,
    metodo_pago    VARCHAR(30) NOT NULL DEFAULT 'EFECTIVO',
    referencia     VARCHAR(60),
    cajero_id      BIGINT REFERENCES usuarios(id),
    observaciones  TEXT,
    creado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alertas (
    id              BIGSERIAL PRIMARY KEY,
    tipo            VARCHAR(30) NOT NULL,
    mensaje         VARCHAR(200) NOT NULL,
    suscriptor_id   BIGINT REFERENCES suscriptores(id),
    comunidad_id    BIGINT NOT NULL REFERENCES comunidades(id),
    estado          VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    fecha_resuelta  TIMESTAMP,
    resuelta_por_id BIGINT REFERENCES usuarios(id),
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_suscriptores_comunidad ON suscriptores(comunidad_id);
CREATE INDEX IF NOT EXISTS idx_medidores_suscriptor ON medidores(suscriptor_id);
CREATE INDEX IF NOT EXISTS idx_lecturas_medidor_periodo ON lecturas(medidor_id, anio, mes);
CREATE INDEX IF NOT EXISTS idx_facturas_suscriptor ON facturas(suscriptor_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_factura ON pagos(factura_id);
CREATE INDEX IF NOT EXISTS idx_alertas_comunidad_estado ON alertas(comunidad_id, estado);
