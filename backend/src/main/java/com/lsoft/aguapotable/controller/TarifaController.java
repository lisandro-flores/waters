package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Tarifa;
import com.lsoft.aguapotable.dto.request.TarifaRequest;
import com.lsoft.aguapotable.service.TarifaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tarifas")
@RequiredArgsConstructor
@Tag(name = "Tarifas", description = "Gestión de tarifas escalonadas por tipo de suscriptor")
@SecurityRequirement(name = "bearerAuth")
public class TarifaController {

    private final TarifaService tarifaService;

    @GetMapping
    @Operation(summary = "Listar tarifas activas de la comunidad")
    public ResponseEntity<List<Tarifa>> listar(HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(tarifaService.listarActivas(comunidadId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener tarifa por ID")
    public ResponseEntity<Tarifa> getById(@PathVariable Long id, HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(tarifaService.obtenerPorId(id, comunidadId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Crear nueva tarifa con rangos escalonados")
    public ResponseEntity<Tarifa> crear(@Valid @RequestBody TarifaRequest dto,
                                         HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.status(201).body(tarifaService.crear(dto, comunidadId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Actualizar tarifa y sus rangos")
    public ResponseEntity<Tarifa> actualizar(@PathVariable Long id,
                                              @Valid @RequestBody TarifaRequest dto,
                                              HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(tarifaService.actualizar(id, dto, comunidadId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Desactivar tarifa")
    public ResponseEntity<Void> desactivar(@PathVariable Long id, HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        tarifaService.desactivar(id, comunidadId);
        return ResponseEntity.noContent().build();
    }
}
