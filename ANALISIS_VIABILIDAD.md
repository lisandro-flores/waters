# Análisis de Viabilidad y Rentabilidad
## Sistema de Gestión de Agua Potable — AguaPotable SaaS

> **Fecha de análisis:** Marzo 2026  
> **Elaborado por:** L-Soft  
> **Modelo de negocio:** SaaS multi-tenant para comunidades rurales y semiurbanas

---

## 1. El Problema que Resuelve

Las comunidades pequeñas que gestionan su propio sistema de agua potable (Juntas de Agua, JASS, Comités de Agua) enfrentan:

| Problema | Impacto |
|---|---|
| Gestión en cuadernos/Excel manual | Pérdida de datos, errores en lecturas |
| Facturación artesanal | Subrecaudación estimada del 20–40% |
| Sin alertas de morosidad | Deuda acumulada sin seguimiento |
| Sin reportes históricos | Incapacidad de planificar mejoras |
| Personal no especializado | Rotación constante sin transferencia de conocimiento |
| Tarifas estáticas | No aplican tarifas escalonadas que financien mantenimiento |

**Estimado de pérdida económica media por comunidad:** $80–$250/mes por subrecaudación y falta de control.

---

## 2. Mercado Objetivo

### 2.1 Mercado Latinoamericano (TAM)

| País | Organizaciones comunitarias de agua estimadas | Fuente de referencia |
|---|---|---|
| **Perú** | ~7,000 JASS (Juntas Administradoras de Servicios de Saneamiento) | SUNASS 2024 |
| **Ecuador** | ~4,500 Juntas de Agua Potable | SENAGUA / ARCA |
| **Colombia** | ~12,000 Acueductos Comunitarios | Superservicios |
| **Bolivia** | ~3,500 EPSA comunitarias | MMAyA |
| **Guatemala** | ~6,000 COCODE con sistema de agua | MSPAS |
| **Honduras** | ~4,200 Juntas de Agua | SANAA |
| **Nicaragua** | ~2,800 CAPS | INAA |
| **Otros LAC** | ~15,000+ | Estimado regional |
| **TOTAL** | **~55,000+** | |

### 2.2 Características del Cliente Ideal

- Comunidad de **50 a 2,000 suscriptores**
- Con servicio de agua operativo pero gestión informal
- Con alguna capacidad de pago mensual (organización con ingresos propios)
- Acceso mínimo a internet (para el administrador)
- Apoyada por municipio, ONG o proyecto gubernamental

### 2.3 Segmentos secundarios

- **Municipios pequeños** que quieren digitalizar juntas en su jurisdicción (compra por lote)
- **ONG y organismos de cooperación** que buscan herramienta para sus proyectos de agua y saneamiento (USAID, BID, UNICEF, CAF)
- **Empresas de servicios públicos** que administran múltiples pequeños sistemas

---

## 3. Propuesta de Valor

```
✔ Reducción de subrecaudación (promedio 25–40% más de cobro al estandarizar facturación)
✔ Tiempo de cobro reducido de horas → minutos
✔ Alertas automáticas al 1° de cada mes (sin esfuerzo del operador)
✔ Multi-tenant: una sola instalación, miles de comunidades
✔ Datos 100% en la nube, sin pérdida por rotación de personal
✔ Informes financieros en tiempo real
✔ Adaptable: tarifas escalonadas por tipo de usuario
✔ Módulo de roles: admin, operador, cajero — no se requiere experto TI
```

---

## 4. Modelo de Negocio y Precios

### 4.1 Planes SaaS (precio/mes por comunidad)

| Plan | Suscriptores max. | Precio/mes | Incluye |
|---|---|---|---|
| **Básico** | Hasta 100 | **$15** | Suscriptores, lecturas, facturación básica, 1 usuario |
| **Estándar** | Hasta 500 | **$35** | Todo lo básico + tarifas escalonadas, reportes, 5 usuarios, alertas |
| **Premium** | Hasta 2,000 | **$65** | Todo + múltiples administradores, soporte prioritario, exportación PDF |
| **Municipal** | Ilimitado (multi-comunidad) | **$150** | Gestión de N juntas desde 1 panel, reportes consolidados |

### 4.2 Ingresos adicionales

| Servicio | Precio estimado |
|---|---|
| Onboarding / migración de datos | $50–$150 único |
| Capacitación presencial (1 día) | $80–$200 |
| Soporte técnico premium mensual | $20/mes adicional |
| Personalización de marca (whitelabel) | $200 único |
| Integración con sistema municipal | Cotización ($500–$2,000) |

---

## 5. Proyecciones de Ingresos (MRR/ARR)

### 5.1 Escenario Conservador — Año 1 a 5

Asumiendo captación de **0.05%** del mercado total en Año 1, creciendo al 0.5% en Year 3.

| Año | Comunidades activas | ARPu/mes (promedio) | MRR | ARR |
|---|---|---|---|---|
| **Año 1** | 30 | $30 | $900 | **$10,800** |
| **Año 2** | 100 | $33 | $3,300 | **$39,600** |
| **Año 3** | 280 | $38 | $10,640 | **$127,680** |
| **Año 4** | 600 | $42 | $25,200 | **$302,400** |
| **Año 5** | 1,200 | $45 | $54,000 | **$648,000** |

> *ARPu = Average Revenue Per Unit (comunidad)*

### 5.2 Escenario Optimista — Con Partners (ONG / Municipios)

Con 2 contratos municipales/ONG de 50+ comunidades c/u al Year 2:

| Año | Comunidades activas | MRR | ARR |
|---|---|---|---|
| **Año 1** | 50 | $1,750 | **$21,000** |
| **Año 2** | 300 | $11,500 | **$138,000** |
| **Año 3** | 800 | $32,000 | **$384,000** |
| **Año 4** | 1,800 | $76,500 | **$918,000** |
| **Año 5** | 3,500 | $157,500 | **$1,890,000** |

---

## 6. Estructura de Costos

### 6.1 Desarrollo (Inversión Inicial)

| Rubro | Costo estimado (USD) |
|---|---|
| Desarrollo backend (Spring Boot) — esqueleto + producción | $8,000–$15,000 |
| Desarrollo frontend (Angular) — diseño + módulos completos | $6,000–$12,000 |
| QA, testing, demo desplegada | $2,000–$4,000 |
| **Total desarrollo MVP** | **$16,000–$31,000** |

> Con un equipo interno de 1–2 desarrolladores senior, el costo es equivalente a **3–5 meses de trabajo.**

### 6.2 Costos Operativos Mensuales (30 comunidades activas)

| Rubro | Costo/mes |
|---|---|
| Infraestructura cloud (VPS + DB, Railway/DigitalOcean/Render) | $40–$80 |
| Dominio + SSL | $2 |
| Herramientas (CI/CD, monitoring, backups) | $20–$40 |
| Soporte técnico (1 persona part-time) | $300–$500 |
| Marketing básico (ads + redes) | $100–$200 |
| **Total OPEX mensual** | **~$462–$822** |

A partir de **~25 comunidades activas en plan Básico** el sistema es **operativamente autosuficiente**.

### 6.3 Costo por Comunidad Nueva (CAC)

| Canal | CAC estimado |
|---|---|
| ONG/organismo (alianza) | $20–$50 |
| Municipio (lote de juntas) | $15–$30/junta |
| Prospectos directos (demo + onboarding) | $80–$150 |
| Referidos | $10–$30 |

---

## 7. Indicadores Financieros Clave

### 7.1 Break-Even

| Escenario | Break-even |
|---|---|
| Equipo externo (costo $25,000) | **~24 meses** con crecimiento conservador |
| Equipo interno (costo ~$8,000 oportunidad) | **~10 meses** |
| Con primer contrato municipal (50 juntas) | **~6 meses** |

### 7.2 Margen Bruto (Año 2+)

```
Ingresos mensuales (100 comunidades × $33)  =  $3,300
Costos operativos mensuales                 =  $700
────────────────────────────────────────────────────
Margen bruto mensual                        =  $2,600  (79%)
```

**El margen bruto del modelo SaaS supera el 75%** una vez amortizado el desarrollo.

### 7.3 LTV vs CAC

| Métrica | Valor estimado |
|---|---|
| Churn rate mensual estimado | 1.5–3% |
| Vida media del cliente | 33–67 meses (~3–5 años) |
| LTV plan Estándar ($35/mes × 48 meses) | **$1,680** |
| CAC promedio | **$80** |
| **Ratio LTV/CAC** | **~21x** (excelente: target > 3x) |

---

## 8. Análisis de Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Baja adopción tecnológica en comunidades rurales | Media | Alto | Interfaz simplísima, capacitación, versión offline-first futura |
| Competencia de soluciones gubernamentales gratuitas | Baja-Media | Medio | Diferenciación por soporte local + flexibilidad |
| Churn por dificultad de pago (USD en zonas rurales) | Media | Medio | Integrar pagos locales (transferencias QR, efectivo) |
| Dependencia de conectividad a internet | Media | Alto | PWA offline-first + sincronización diferida (roadmap) |
| Falta de personal técnico en comunidades | Alta | Medio | Módulo de self-service + tutoriales en video + WhatsApp bot |
| Cambios regulatorios en tarifas de agua | Baja | Bajo | Sistema adaptable por comunidad (config de tarifas propia) |

---

## 9. Ventajas Competitivas (Moat)

1. **Especialización vertical** — no es un ERP genérico, es específico para agua comunitaria
2. **Multi-tenant nativo** — una sola instancia sirve N comunidades con datos aislados
3. **Bajo costo de infraestructura por comunidad** (< $1/mes en infra por tenant)
4. **Tarifas escalonadas automáticas** — diferenciador técnico clave
5. **Historial de datos** — después de 12 meses de uso, el cliente no quiere migrar (lock-in natural)
6. **Red de referidos** — cada organismo que adopta el sistema conecta múltiples comunidades

---

## 10. Roadmap y Prioridades de Producto

### Corto plazo (1–3 meses) — MVP producción
- [ ] Completar controladores REST de Medidores, Tarifas y Alertas
- [ ] Módulo de usuarios en Configuración (frontend)
- [ ] Gráficos de recaudación (Chart.js)
- [ ] Exportar facturas a PDF
- [ ] Tests unitarios básicos (JUnit + Jasmine)

### Mediano plazo (3–6 meses) — Crecimiento
- [ ] App móvil (Angular + Capacitor) para lecturistas en campo
- [ ] PWA offline-first para zonas sin internet
- [ ] Integración WhatsApp (avisos de deuda, comprobantes)
- [ ] Portal de autopago para suscriptores
- [ ] Dashboard multi-comunidad para operadores municipales

### Largo plazo (6–18 meses) — Escala
- [ ] Módulo IoT — integración con medidores electrónicos
- [ ] Análisis predictivo de pérdidas (IA)
- [ ] Marketplace de proveedores de materiales/mantenimiento
- [ ] Certificaciones SUNASS/ARCA para implementación oficial

---

## 11. Estrategia de Go-to-Market

```
Fase 1 (0–6 meses):    1 comunidad piloto gratis → caso de éxito + logo
Fase 2 (6–12 meses):   Contactar 3 ONG con portfolio de juntas de agua
                        → vender como paquete (precio por comunidad)
Fase 3 (12–24 meses):  Presentar a 2 municipios rurales como herramienta
                        para digitalizar sus juntas → contrato marco
Fase 4 (24+ meses):    Canal de revendedores locales en cada país (técnicos
                        locales certificados que instalan + capacitan)
```

---

## 12. Conclusión y Recomendación

| Criterio | Evaluación |
|---|---|
| **Tamaño de mercado** | ✅ Grande (55,000+ organizaciones en LAC) |
| **Problema real y urgente** | ✅ Sí — pérdidas económicas verificables |
| **Modelo de negocio** | ✅ SaaS recurrente, alta previsibilidad |
| **Margen bruto** | ✅ >75% en escala |
| **Costo de desarrollo** | ✅ Bajo (ya existe la arquitectura base) |
| **Competencia directa** | ✅ Mínima en nicho rural/comunitario |
| **Barrera de entrada** | ⚠️ Media-baja (cualquiera puede copiar) |
| **Dependencia de conectividad** | ⚠️ Riesgo real en zonas rurales |

### Veredicto: **VIABLE — Alta recomendación de continuar**

> El proyecto tiene una propuesta de valor clara, un mercado desatendido enorme y un modelo de
> negocio de márgenes superiores al 75%. La inversión para llevar el MVP a producción es
> asequible (< $30,000 o 4 meses de trabajo interno). La recuperación de inversión puede
> lograrse en **menos de 12 meses** con una estrategia de alianzas con organismos que ya
> trabajan con comunidades de agua potable.
>
> **Acción prioritaria:** Desplegar una demo funcional pública y contactar 1–2 organizaciones
> de agua que sirvan como clientes ancla para validar el producto en campo.
