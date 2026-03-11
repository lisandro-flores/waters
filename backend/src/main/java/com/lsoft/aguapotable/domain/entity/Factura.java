package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lsoft.aguapotable.domain.enums.EstadoFactura;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Factura mensual generada a partir de una lectura.
 * Incluye consumo, tarifa base, recargos y mora.
 */
@Entity
@Table(name = "facturas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Número de factura único dentro de la comunidad */
    @Column(nullable = false, length = 20)
    private String numeroFactura;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "medidores", "facturas", "comunidad"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suscriptor_id", nullable = false)
    private Suscriptor suscriptor;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "medidor", "lector"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lectura_id", nullable = false)
    private Lectura lectura;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "comunidad", "rangos"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tarifa_id", nullable = false)
    private Tarifa tarifa;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private Integer mes;

    /** Consumo en m³ copiado desde la lectura */
    @Column(nullable = false)
    private Double consumoM3;

    /** Cargo fijo o cuota base */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montoBase;

    /** Monto calculado por consumo según tarifa escalonada */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montoConsumo;

    /** Otros cargos adicionales (alcantarillado, basura, etc.) */
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal otrosCargos = BigDecimal.ZERO;

    /** Descuentos aplicados */
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal descuentos = BigDecimal.ZERO;

    /** Interés por mora acumulado */
    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal mora = BigDecimal.ZERO;

    /** Total a pagar */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPagar;

    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoFactura estado = EstadoFactura.PENDIENTE;

    @JsonIgnore
    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pago> pagos;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;
}
