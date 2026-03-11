package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Factura;
import com.lsoft.aguapotable.domain.enums.EstadoFactura;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FacturaRepository extends JpaRepository<Factura, Long> {

    Optional<Factura> findByNumeroFacturaAndSuscriptorComunidadId(String numeroFactura, Long comunidadId);

    Page<Factura> findBySuscriptorComunidadId(Long comunidadId, Pageable pageable);

    List<Factura> findBySuscriptorIdOrderByAnioDescMesDesc(Long suscriptorId);

    List<Factura> findBySuscriptorComunidadIdAndEstado(Long comunidadId, EstadoFactura estado);

    /** Facturas vencidas sin pagar para aplicar mora */
    @Query("SELECT f FROM Factura f WHERE f.suscriptor.comunidad.id = :comunidadId " +
           "AND f.estado IN ('PENDIENTE','PAGADA_PARCIAL') " +
           "AND f.fechaVencimiento < :hoy")
    List<Factura> facturasMorosas(@Param("comunidadId") Long comunidadId,
                                   @Param("hoy") LocalDate hoy);

    /** Suma total facturado en un período */
    @Query("SELECT COALESCE(SUM(f.totalPagar), 0) FROM Factura f " +
           "WHERE f.suscriptor.comunidad.id = :comunidadId " +
           "AND f.anio = :anio AND f.mes = :mes AND f.estado != 'ANULADA'")
    BigDecimal sumTotalPeriodo(@Param("comunidadId") Long comunidadId,
                                @Param("anio") Integer anio,
                                @Param("mes") Integer mes);
}
