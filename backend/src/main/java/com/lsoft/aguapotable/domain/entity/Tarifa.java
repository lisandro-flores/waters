package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lsoft.aguapotable.domain.enums.TipoSuscriptor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Tarifa (pliego tarifario) vigente en una comunidad.
 * Soporta estructura escalonada por rangos de consumo.
 */
@Entity
@Table(name = "tarifas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tarifa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad_id", nullable = false)
    private Comunidad comunidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoSuscriptor tipoSuscriptor;

    /** Cuota fija mensual (independiente del consumo) */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cuotaFija;

    /** Porcentaje de mora por mes vencido (ej. 0.02 = 2%) */
    @Column(nullable = false, precision = 5, scale = 4)
    @Builder.Default
    private BigDecimal porcentajeMora = new BigDecimal("0.0200");

    /** Días de gracia antes de aplicar mora */
    @Column(nullable = false)
    @Builder.Default
    private Integer diasGracia = 15;

    private LocalDate vigenciaDesde;
    private LocalDate vigenciaHasta;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    /** Rangos de consumo para tarifa escalonada */
    @OneToMany(mappedBy = "tarifa", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rangoDesde ASC")
    private List<TarifaRango> rangos;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;
}
