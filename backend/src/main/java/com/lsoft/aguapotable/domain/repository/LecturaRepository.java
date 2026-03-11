package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Lectura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LecturaRepository extends JpaRepository<Lectura, Long> {

    Optional<Lectura> findByMedidorIdAndAnioAndMes(Long medidorId, Integer anio, Integer mes);

    List<Lectura> findByMedidorIdOrderByAnioDescMesDesc(Long medidorId);

    /** Lecturas de toda una comunidad en un período */
    @Query("SELECT l FROM Lectura l " +
           "JOIN l.medidor m JOIN m.suscriptor s " +
           "WHERE s.comunidad.id = :comunidadId AND l.anio = :anio AND l.mes = :mes")
    List<Lectura> findByComunidadAndPeriodo(@Param("comunidadId") Long comunidadId,
                                             @Param("anio") Integer anio,
                                             @Param("mes") Integer mes);

    /** Medidores de una comunidad que NO tienen lectura en el período */
    @Query("SELECT m.id FROM Medidor m JOIN m.suscriptor s " +
           "WHERE s.comunidad.id = :comunidadId " +
           "AND m.estado = 'ACTIVO' " +
           "AND NOT EXISTS (SELECT 1 FROM Lectura l WHERE l.medidor = m AND l.anio = :anio AND l.mes = :mes)")
    List<Long> medidoresSinLectura(@Param("comunidadId") Long comunidadId,
                                   @Param("anio") Integer anio,
                                   @Param("mes") Integer mes);
}
