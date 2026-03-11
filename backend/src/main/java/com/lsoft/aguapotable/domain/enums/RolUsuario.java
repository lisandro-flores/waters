package com.lsoft.aguapotable.domain.enums;

public enum RolUsuario {
    /** Administrador supremo del sistema (puede crear comunidades) */
    SUPER_ADMIN,
    /** Administrador de una comunidad */
    ADMIN,
    /** Operador / lecturista de campo */
    OPERADOR,
    /** Cajero: registra pagos y emite facturas */
    CAJERO,
    /** Solo lectura / consulta */
    CONSULTA
}
