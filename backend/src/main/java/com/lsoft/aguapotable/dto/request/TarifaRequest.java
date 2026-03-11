package com.lsoft.aguapotable.dto.request;

import com.lsoft.aguapotable.domain.enums.TipoSuscriptor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TarifaRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100)
    private String nombre;

    @NotNull(message = "El tipo de suscriptor es requerido")
    private TipoSuscriptor tipoSuscriptor;

    @NotNull(message = "La cuota fija es requerida")
    private BigDecimal cuotaFija;

    private BigDecimal porcentajeMora = new BigDecimal("0.0200");

    @Min(value = 0)
    private Integer diasGracia = 15;

    private LocalDate vigenciaDesde;
    private LocalDate vigenciaHasta;

    private List<RangoRequest> rangos;

    @Data
    public static class RangoRequest {
        @NotNull
        private Double rangoDesde;
        private Double rangoHasta;
        @NotNull
        private BigDecimal precioPorM3;
    }
}
