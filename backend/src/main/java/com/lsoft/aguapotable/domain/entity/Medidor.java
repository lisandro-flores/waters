package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lsoft.aguapotable.domain.enums.EstadoMedidor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Medidor de agua asignado a un suscriptor.
 * Un suscriptor puede tener múltiples medidores (ej. uso comercial + domiciliar).
 */
@Entity
@Table(name = "medidores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Medidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Número de serie grabado en el medidor físico */
    @Column(nullable = false, unique = true, length = 50)
    private String numeroSerie;

    /** Marca del medidor */
    @Column(length = 80)
    private String marca;

    /** Diámetro en pulgadas (1/2", 3/4", 1", etc.) */
    @Column(length = 10)
    private String diametro;

    /** Lectura inicial al instalar el medidor */
    @Column(nullable = false)
    @Builder.Default
    private Double lecturaInicial = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoMedidor estado = EstadoMedidor.ACTIVO;

    private LocalDate fechaInstalacion;
    private LocalDate fechaBaja;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "medidores", "facturas"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "suscriptor_id", nullable = false)
    private Suscriptor suscriptor;

    @JsonIgnore
    @OneToMany(mappedBy = "medidor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Lectura> lecturas;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;
}
