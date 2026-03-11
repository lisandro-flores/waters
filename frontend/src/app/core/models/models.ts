// ==================== MODELOS DE DOMINIO ====================

export interface Comunidad {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  provincia?: string;
  municipio?: string;
  activo: boolean;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  telefono?: string;
  activo: boolean;
  comunidadId: number;
}

export interface Suscriptor {
  id: number;
  numeroCuenta: string;
  nombre: string;
  apellido: string;
  identificacion?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  tipo: TipoSuscriptor;
  estado: EstadoSuscriptor;
  fechaIngreso?: string;
  comunidadId: number;
}

export interface Medidor {
  id: number;
  numeroSerie: string;
  marca?: string;
  diametro?: string;
  lecturaInicial: number;
  estado: EstadoMedidor;
  fechaInstalacion?: string;
  suscriptorId: number;
  suscriptorNombre?: string;
}

export interface Lectura {
  id: number;
  medidorId: number;
  medidorSerie?: string;
  anio: number;
  mes: number;
  lecturaAnterior: number;
  lecturaActual: number;
  consumoM3: number;
  fechaLectura?: string;
  estimada: boolean;
  observaciones?: string;
}

export interface Tarifa {
  id: number;
  nombre: string;
  tipoSuscriptor: TipoSuscriptor;
  cuotaFija: number;
  porcentajeMora: number;
  diasGracia: number;
  vigenciaDesde?: string;
  vigenciaHasta?: string;
  activo: boolean;
  rangos: TarifaRango[];
}

export interface TarifaRango {
  id?: number;
  rangoDesde: number;
  rangoHasta?: number;
  precioPorM3: number;
}

export interface Factura {
  id: number;
  numeroFactura: string;
  suscriptorId: number;
  suscriptorNombre?: string;
  numeroCuenta?: string;
  anio: number;
  mes: number;
  consumoM3: number;
  montoBase: number;
  montoConsumo: number;
  otrosCargos: number;
  descuentos: number;
  mora: number;
  totalPagar: number;
  fechaEmision?: string;
  fechaVencimiento?: string;
  estado: EstadoFactura;
}

export interface Pago {
  id: number;
  facturaId: number;
  numeroFactura?: string;
  monto: number;
  fechaPago: string;
  metodoPago: MetodoPago;
  referencia?: string;
  cajerNombre?: string;
}

export interface Alerta {
  id: number;
  tipo: TipoAlerta;
  mensaje: string;
  suscriptorId?: number;
  suscriptorNombre?: string;
  estado: EstadoAlerta;
  creadoEn: string;
}

// ==================== ENUMS (como tipos de string) ====================

export type RolUsuario = 'SUPER_ADMIN' | 'ADMIN' | 'OPERADOR' | 'CAJERO' | 'CONSULTA';
export type TipoSuscriptor = 'DOMICILIAR' | 'COMERCIAL' | 'INDUSTRIAL' | 'INSTITUCIONAL';
export type EstadoSuscriptor = 'ACTIVO' | 'SUSPENDIDO' | 'CORTADO' | 'RETIRADO';
export type EstadoMedidor = 'ACTIVO' | 'SUSPENDIDO' | 'RETIRADO' | 'EN_REPARACION';
export type EstadoFactura = 'PENDIENTE' | 'PAGADA' | 'PAGADA_PARCIAL' | 'VENCIDA' | 'ANULADA';
export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'DEPOSITO_BANCARIO' | 'TARJETA_DEBITO' | 'TARJETA_CREDITO' | 'PAGO_MOVIL';
export type TipoAlerta = 'CONSUMO_ANOMALO' | 'MORA_VENCIDA' | 'MEDIDOR_SIN_LECTURA' | 'FUGA_POSIBLE' | 'SUSCRIPTOR_SUSPENDIDO' | 'MANTENIMIENTO';
export type EstadoAlerta = 'PENDIENTE' | 'EN_GESTION' | 'RESUELTA' | 'DESCARTADA';

// ==================== DTOs de AUTH ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  comunidadId: number;
  comunidadNombre: string;
}

// ==================== PAGINACIÓN ====================

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ==================== DASHBOARD ====================

export interface DashboardData {
  totalSuscriptores: number;
  facturadoMesActual: number;
  recaudadoMesActual: number;
  cuentasPendientes: number;
  cuentasMorosas: number;
}
