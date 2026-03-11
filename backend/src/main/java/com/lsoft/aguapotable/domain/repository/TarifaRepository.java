package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Tarifa;
import com.lsoft.aguapotable.domain.enums.TipoSuscriptor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TarifaRepository extends JpaRepository<Tarifa, Long> {

    List<Tarifa> findByComunidadIdAndActivoTrue(Long comunidadId);

    @Query("SELECT t FROM Tarifa t WHERE t.comunidad.id = :comunidadId " +
           "AND t.tipoSuscriptor = :tipo " +
           "AND t.activo = true " +
           "AND (t.vigenciaDesde IS NULL OR t.vigenciaDesde <= :fecha) " +
           "AND (t.vigenciaHasta IS NULL OR t.vigenciaHasta >= :fecha) " +
           "ORDER BY t.vigenciaDesde DESC")
    Optional<Tarifa> findActivaByComunidadAndTipo(@Param("comunidadId") Long comunidadId,
                                                   @Param("tipo") TipoSuscriptor tipo,
                                                   @Param("fecha") LocalDate fecha);
}
