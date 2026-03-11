package com.lsoft.aguapotable.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LecturaRequest {

    @NotNull(message = "El ID del medidor es requerido")
    private Long medidorId;

    @NotNull(message = "La lectura anterior es requerida")
    @Min(value = 0, message = "La lectura anterior no puede ser negativa")
    private Double lecturaAnterior;

    @NotNull(message = "La lectura actual es requerida")
    @Min(value = 0, message = "La lectura actual no puede ser negativa")
    private Double lecturaActual;

    private LocalDate fechaLectura;
    private String observaciones;
    private Boolean estimada = false;
}
