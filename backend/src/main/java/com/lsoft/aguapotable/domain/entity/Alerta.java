package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lsoft.aguapotable.domain.enums.EstadoAlerta;
import com.lsoft.aguapotable.domain.enums.TipoAlerta;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * Alertas y notificaciones del sistema.
 * Ejemplos: consumo anómalo, mora vencida, medidor sin lectura.
 */
@Entity
@Table(name = "alertas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAlerta tipo;

    @Column(nullable = false, length = 200)
    private String mensaje;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "medidores", "facturas", "comunidad"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suscriptor_id")
    private Suscriptor suscriptor;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad_id", nullable = false)
    private Comunidad comunidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoAlerta estado = EstadoAlerta.PENDIENTE;

    private LocalDateTime fechaResuelta;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password", "comunidad"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resuelta_por_id")
    private Usuario resueltaPor;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;
}
