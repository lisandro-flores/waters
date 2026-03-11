package com.lsoft.aguapotable.domain.enums;

public enum TipoAlerta {
    CONSUMO_ANOMALO,       // consumo inusualmente alto o bajo
    MORA_VENCIDA,          // factura con mora pendiente
    MEDIDOR_SIN_LECTURA,   // mes sin registrar lectura
    FUGA_POSIBLE,          // consumo nocturno detectado
    SUSCRIPTOR_SUSPENDIDO, // corte por deuda
    MANTENIMIENTO          // alerta programada de mantenimiento
}
