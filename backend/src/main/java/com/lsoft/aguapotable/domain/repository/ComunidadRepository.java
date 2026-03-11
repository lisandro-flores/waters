package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Comunidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComunidadRepository extends JpaRepository<Comunidad, Long> {
    Optional<Comunidad> findByNombre(String nombre);
    List<Comunidad> findByActivoTrue();
    boolean existsByNombre(String nombre);
}
