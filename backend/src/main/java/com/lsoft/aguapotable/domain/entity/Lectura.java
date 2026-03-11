package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Lectura mensual de un medidor.
 * El consumo en m³ = lecturaActual - lecturaAnterior.
 */
@Entity
@Table(name = "lecturas",
       uniqueConstraints = @UniqueConstraint(columnNames = {"medidor_id", "anio", "mes"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lectura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "lecturas", "suscriptor"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medidor_id", nullable = false)
    private Medidor medidor;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private Integer mes;

    /** Lectura del medidor al inicio del período */
    @Column(nullable = false)
    private Double lecturaAnterior;

    /** Lectura del medidor al cierre del período */
    @Column(nullable = false)
    private Double lecturaActual;

    /** Consumo calculado en m³ */
    @Column(nullable = false)
    private Double consumoM3;

    private LocalDate fechaLectura;

    /** Usuario que realizó la lectura */
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "comunidad"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lector_id")
    private Usuario lector;

    private String observaciones;

    /** Indica si la lectura está estimada (por inconveniente en el campo) */
    @Builder.Default
    private Boolean estimada = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;
}
