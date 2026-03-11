package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.service.FacturacionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/facturacion")
@RequiredArgsConstructor
@Tag(name = "Facturación", description = "Generación de facturas a partir de lecturas")
@SecurityRequirement(name = "bearerAuth")
public class FacturacionController {

    private final FacturacionService facturacionService;

    @PostMapping("/generar/{lecturaId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CAJERO')")
    @Operation(summary = "Generar factura individual para una lectura")
    public ResponseEntity<?> generarFactura(@PathVariable Long lecturaId,
                                             HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.status(201).body(facturacionService.generarFactura(lecturaId, comunidadId));
    }

    @PostMapping("/generar-masivo")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Generación masiva de facturas para todo el período")
    public ResponseEntity<Map<String, Object>> generarMasivo(
            @RequestParam Integer anio,
            @RequestParam Integer mes,
            HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        int generadas = facturacionService.generarFacturasMasivas(comunidadId, anio, mes);
        return ResponseEntity.ok(Map.of("facturasGeneradas", generadas, "anio", anio, "mes", mes));
    }
}
