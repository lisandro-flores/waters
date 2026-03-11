package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Rango de consumo dentro de una tarifa escalonada.
 * Ejemplo: 0-10 m³ → $0.50/m³,  11-20 m³ → $0.80/m³, 21+ m³ → $1.20/m³
 */
@Entity
@Table(name = "tarifa_rangos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TarifaRango {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarifa_id", nullable = false)
    private Tarifa tarifa;

    /** m³ inicial del rango (inclusive) */
    @Column(nullable = false)
    private Double rangoDesde;

    /** m³ final del rango (inclusive). Null = sin límite superior */
    private Double rangoHasta;

    /** Precio por m³ dentro del rango */
    @Column(nullable = false, precision = 10, scale = 4)
    private BigDecimal precioPorM3;
}
