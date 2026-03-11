package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lsoft.aguapotable.domain.enums.EstadoSuscriptor;
import com.lsoft.aguapotable.domain.enums.TipoSuscriptor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Suscriptor (beneficiario) del servicio de agua.
 * Persona que paga por el servicio en una comunidad.
 */
@Entity
@Table(name = "suscriptores")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Suscriptor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Número de cuenta/código de suscripción dentro de la comunidad */
    @Column(nullable = false, length = 20)
    private String numeroCuenta;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    /** DUI, Cédula, DNI u otro identificador */
    @Column(length = 20)
    private String identificacion;

    @Column(length = 200)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Column(length = 150)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoSuscriptor tipo = TipoSuscriptor.DOMICILIAR;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoSuscriptor estado = EstadoSuscriptor.ACTIVO;

    private LocalDate fechaIngreso;

    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comunidad_id", nullable = false)
    private Comunidad comunidad;

    @JsonIgnore
    @OneToMany(mappedBy = "suscriptor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Medidor> medidores;

    @JsonIgnore
    @OneToMany(mappedBy = "suscriptor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Factura> facturas;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;
}
