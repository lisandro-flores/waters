package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.repository.FacturaRepository;
import com.lsoft.aguapotable.domain.repository.PagoRepository;
import com.lsoft.aguapotable.domain.repository.SuscriptorRepository;
import com.lsoft.aguapotable.domain.enums.EstadoSuscriptor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Servicio de reportes y estadísticas del sistema.
 */
@Service
@RequiredArgsConstructor
public class ReporteService {

    private final FacturaRepository facturaRepository;
    private final PagoRepository pagoRepository;
    private final SuscriptorRepository suscriptorRepository;

    /**
     * Dashboard: resumen operativo de la comunidad.
     */
    public Map<String, Object> getDashboard(Long comunidadId) {
        LocalDate hoy = LocalDate.now();
        LocalDate inicioMes = hoy.withDayOfMonth(1);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalSuscriptores", suscriptorRepository.countByComunidadIdAndEstado(comunidadId, EstadoSuscriptor.ACTIVO));
        data.put("facturadoMesActual", facturaRepository.sumTotalPeriodo(comunidadId, hoy.getYear(), hoy.getMonthValue()));
        data.put("recaudadoMesActual", pagoRepository.sumRecaudadoPeriodo(comunidadId, inicioMes, hoy));
        data.put("cuentasPendientes", facturaRepository.findBySuscriptorComunidadIdAndEstado(
                comunidadId, com.lsoft.aguapotable.domain.enums.EstadoFactura.PENDIENTE).size());
        data.put("cuentasMorosas", facturaRepository.facturasMorosas(comunidadId, hoy).size());
        return data;
    }

    /**
     * Reporte de morosidad: facturas vencidas con saldos.
     */
    public Map<String, Object> getReporteMorosidad(Long comunidadId) {
        LocalDate hoy = LocalDate.now();
        var facturasMorosas = facturaRepository.facturasMorosas(comunidadId, hoy);

        BigDecimal totalDeuda = facturasMorosas.stream()
                .map(f -> f.getTotalPagar())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> reporte = new LinkedHashMap<>();
        reporte.put("totalFacturasMorosas", facturasMorosas.size());
        reporte.put("totalDeuda", totalDeuda);
        reporte.put("facturas", facturasMorosas);
        return reporte;
    }

    /**
     * Reporte de recaudación mensual (12 últimos meses).
     */
    public Map<String, BigDecimal> getRecaudacionMensual(Long comunidadId) {
        Map<String, BigDecimal> resultado = new LinkedHashMap<>();
        LocalDate hoy = LocalDate.now();
        for (int i = 11; i >= 0; i--) {
            LocalDate mes = hoy.minusMonths(i);
            LocalDate inicio = mes.withDayOfMonth(1);
            LocalDate fin = mes.withDayOfMonth(mes.lengthOfMonth());
            BigDecimal recaudado = pagoRepository.sumRecaudadoPeriodo(comunidadId, inicio, fin);
            String label = mes.getYear() + "/" + String.format("%02d", mes.getMonthValue());
            resultado.put(label, recaudado);
        }
        return resultado;
    }
}
