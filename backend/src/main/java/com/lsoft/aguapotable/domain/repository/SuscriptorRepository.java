package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Suscriptor;
import com.lsoft.aguapotable.domain.enums.EstadoSuscriptor;
import com.lsoft.aguapotable.domain.enums.TipoSuscriptor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SuscriptorRepository extends JpaRepository<Suscriptor, Long> {

    Optional<Suscriptor> findByNumeroCuentaAndComunidadId(String numeroCuenta, Long comunidadId);

    Page<Suscriptor> findByComunidadId(Long comunidadId, Pageable pageable);

    List<Suscriptor> findByComunidadIdAndEstado(Long comunidadId, EstadoSuscriptor estado);
    List<Suscriptor> findByComunidadIdAndTipo(Long comunidadId, TipoSuscriptor tipo);

    @Query("SELECT s FROM Suscriptor s WHERE s.comunidad.id = :comunidadId " +
           "AND (LOWER(s.nombre) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.apellido) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(s.numeroCuenta) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Suscriptor> buscar(@Param("comunidadId") Long comunidadId,
                            @Param("q") String q,
                            Pageable pageable);

    long countByComunidadIdAndEstado(Long comunidadId, EstadoSuscriptor estado);
}
