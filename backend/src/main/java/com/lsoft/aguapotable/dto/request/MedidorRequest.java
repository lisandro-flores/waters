package com.lsoft.aguapotable.dto.request;

import com.lsoft.aguapotable.domain.enums.EstadoMedidor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class MedidorRequest {

    @NotBlank(message = "El número de serie es requerido")
    @Size(max = 50)
    private String numeroSerie;

    @Size(max = 80)
    private String marca;

    @Size(max = 10)
    private String diametro;

    private Double lecturaInicial = 0.0;
    private EstadoMedidor estado = EstadoMedidor.ACTIVO;
    private LocalDate fechaInstalacion;

    @NotNull(message = "El ID del suscriptor es requerido")
    private Long suscriptorId;
}
