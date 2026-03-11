-- V2__seed_data.sql
-- Datos iniciales de prueba

-- Comunidad demo
INSERT INTO comunidades (nombre, direccion, telefono, email, provincia, municipio)
VALUES ('Junta de Agua El Progreso', 'Cantón El Progreso, km 45', '2222-1111',
        'elprogreso@agua.com', 'Usulután', 'San Buenaventura')
ON CONFLICT DO NOTHING;

-- Usuario SUPER_ADMIN (password: Admin123!)
INSERT INTO usuarios (nombre, apellido, email, password, rol, comunidad_id)
SELECT 'Super', 'Admin', 'admin@sistema.com',
       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
       'SUPER_ADMIN', id
FROM comunidades WHERE nombre = 'Junta de Agua El Progreso'
ON CONFLICT DO NOTHING;

-- Tarifa domiciliar básica
INSERT INTO tarifas (nombre, comunidad_id, tipo_suscriptor, cuota_fija, vigencia_desde)
SELECT 'Tarifa Domiciliar 2026', id, 'DOMICILIAR', 2.50, '2026-01-01'
FROM comunidades WHERE nombre = 'Junta de Agua El Progreso'
ON CONFLICT DO NOTHING;

-- Rangos de tarifa escalonada
INSERT INTO tarifa_rangos (tarifa_id, rango_desde, rango_hasta, precio_por_m3)
SELECT t.id, 0, 10, 0.30 FROM tarifas t
JOIN comunidades c ON t.comunidad_id = c.id
WHERE c.nombre = 'Junta de Agua El Progreso'
ON CONFLICT DO NOTHING;

INSERT INTO tarifa_rangos (tarifa_id, rango_desde, rango_hasta, precio_por_m3)
SELECT t.id, 10, 20, 0.50 FROM tarifas t
JOIN comunidades c ON t.comunidad_id = c.id
WHERE c.nombre = 'Junta de Agua El Progreso'
ON CONFLICT DO NOTHING;

INSERT INTO tarifa_rangos (tarifa_id, rango_desde, rango_hasta, precio_por_m3)
SELECT t.id, 20, NULL, 0.85 FROM tarifas t
JOIN comunidades c ON t.comunidad_id = c.id
WHERE c.nombre = 'Junta de Agua El Progreso'
ON CONFLICT DO NOTHING;
