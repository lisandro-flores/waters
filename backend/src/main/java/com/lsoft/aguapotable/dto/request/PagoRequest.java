package com.lsoft.aguapotable.dto.request;

import com.lsoft.aguapotable.domain.enums.MetodoPago;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PagoRequest {

    @NotNull(message = "El ID de factura es requerido")
    private Long facturaId;

    @NotNull(message = "El monto es requerido")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a cero")
    private BigDecimal monto;

    private MetodoPago metodoPago = MetodoPago.EFECTIVO;
    private String referencia;
}
