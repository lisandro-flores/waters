package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lsoft.aguapotable.domain.enums.MetodoPago;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Registro de un pago efectuado sobre una factura.
 * Una factura puede tener pagos parciales.
 */
@Entity
@Table(name = "pagos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "suscriptor", "lectura", "tarifa", "pagos"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "factura_id", nullable = false)
    private Factura factura;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monto;

    private LocalDate fechaPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MetodoPago metodoPago = MetodoPago.EFECTIVO;

    /** Número de referencia, recibo o comprobante */
    @Column(length = 60)
    private String referencia;

    /** Usuario cajero que registró el pago */
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "comunidad"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cajero_id")
    private Usuario cajero;

    private String observaciones;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;
}
