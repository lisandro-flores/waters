package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByFacturaId(Long facturaId);

    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p WHERE p.factura.id = :facturaId")
    BigDecimal sumPagadoByFactura(@Param("facturaId") Long facturaId);

    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p " +
           "WHERE p.factura.suscriptor.comunidad.id = :comunidadId " +
           "AND p.fechaPago BETWEEN :desde AND :hasta")
    BigDecimal sumRecaudadoPeriodo(@Param("comunidadId") Long comunidadId,
                                    @Param("desde") LocalDate desde,
                                    @Param("hasta") LocalDate hasta);
}
