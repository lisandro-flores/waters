package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Medidor;
import com.lsoft.aguapotable.domain.enums.EstadoMedidor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedidorRepository extends JpaRepository<Medidor, Long> {
    Optional<Medidor> findByNumeroSerie(String numeroSerie);
    List<Medidor> findBySuscriptorId(Long suscriptorId);
    List<Medidor> findBySuscriptorComunidadIdAndEstado(Long comunidadId, EstadoMedidor estado);
    boolean existsByNumeroSerie(String numeroSerie);
}
