package com.lsoft.aguapotable.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Representa una comunidad/junta de agua.
 * Cada comunidad es un tenant independiente.
 */
@Entity
@Table(name = "comunidades")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comunidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nombre;

    @Column(length = 200)
    private String direccion;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String email;

    /** Código RUC o identificador tributario */
    @Column(length = 20)
    private String ruc;

    /** Provincia / Departamento */
    @Column(length = 80)
    private String provincia;

    @Column(length = 80)
    private String municipio;

    /** Estado activo/inactivo de la comunidad */
    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    private LocalDateTime actualizadoEn;

    @JsonIgnore
    @OneToMany(mappedBy = "comunidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Usuario> usuarios;

    @JsonIgnore
    @OneToMany(mappedBy = "comunidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Suscriptor> suscriptores;

    @JsonIgnore
    @OneToMany(mappedBy = "comunidad", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tarifa> tarifas;
}
