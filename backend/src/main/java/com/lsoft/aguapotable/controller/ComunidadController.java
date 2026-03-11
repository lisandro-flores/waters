package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Comunidad;
import com.lsoft.aguapotable.dto.request.ComunidadRequest;
import com.lsoft.aguapotable.service.ComunidadService;
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
@RequestMapping("/api/v1/comunidades")
@RequiredArgsConstructor
@Tag(name = "Comunidades", description = "Gestión de comunidades (multi-tenant)")
@SecurityRequirement(name = "bearerAuth")
public class ComunidadController {

    private final ComunidadService comunidadService;

    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Listar todas las comunidades activas")
    public ResponseEntity<List<Comunidad>> listar() {
        return ResponseEntity.ok(comunidadService.listarActivas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener comunidad por ID")
    public ResponseEntity<Comunidad> getById(@PathVariable Long id) {
        return ResponseEntity.ok(comunidadService.obtenerPorId(id));
    }

    @GetMapping("/mi-comunidad")
    @Operation(summary = "Obtener datos de la comunidad del usuario actual")
    public ResponseEntity<Comunidad> getMiComunidad(HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(comunidadService.obtenerPorId(comunidadId));
    }

    @PostMapping
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Crear nueva comunidad")
    public ResponseEntity<Comunidad> crear(@Valid @RequestBody ComunidadRequest dto) {
        return ResponseEntity.status(201).body(comunidadService.crear(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Actualizar datos de la comunidad")
    public ResponseEntity<Comunidad> actualizar(@PathVariable Long id,
                                                 @Valid @RequestBody ComunidadRequest dto) {
        return ResponseEntity.ok(comunidadService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Desactivar comunidad")
    public ResponseEntity<Void> desactivar(@PathVariable Long id) {
        comunidadService.desactivar(id);
        return ResponseEntity.noContent().build();
    }
}
