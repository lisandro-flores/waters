package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.service.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reportes")
@RequiredArgsConstructor
@Tag(name = "Reportes", description = "Dashboard y reportes operativos")
@SecurityRequirement(name = "bearerAuth")
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/dashboard")
    @Operation(summary = "Datos del dashboard: KPIs principales de la comunidad")
    public ResponseEntity<Map<String, Object>> getDashboard(HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(reporteService.getDashboard(comunidadId));
    }

    @GetMapping("/morosidad")
    @Operation(summary = "Reporte de cuentas morosas")
    public ResponseEntity<Map<String, Object>> getMorosidad(HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(reporteService.getReporteMorosidad(comunidadId));
    }

    @GetMapping("/recaudacion-mensual")
    @Operation(summary = "Recaudación de los últimos 12 meses (para gráfica)")
    public ResponseEntity<Map<String, BigDecimal>> getRecaudacionMensual(HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(reporteService.getRecaudacionMensual(comunidadId));
    }
}
