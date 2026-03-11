package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Suscriptor;
import com.lsoft.aguapotable.dto.request.SuscriptorRequest;
import com.lsoft.aguapotable.service.SuscriptorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/suscriptores")
@RequiredArgsConstructor
@Tag(name = "Suscriptores", description = "Gestión de suscriptores del servicio de agua")
@SecurityRequirement(name = "bearerAuth")
public class SuscriptorController {

    private final SuscriptorService suscriptorService;

    @GetMapping
    @Operation(summary = "Listar suscriptores paginados de la comunidad")
    public ResponseEntity<Page<Suscriptor>> listar(
            @PageableDefault(size = 20, sort = "numeroCuenta") Pageable pageable,
            @RequestParam(required = false) String q,
            HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(suscriptorService.listar(comunidadId, q, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener suscriptor por ID")
    public ResponseEntity<Suscriptor> getById(@PathVariable Long id,
                                               HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(suscriptorService.obtenerPorId(id, comunidadId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERADOR')")
    @Operation(summary = "Crear nuevo suscriptor")
    public ResponseEntity<Suscriptor> crear(@Valid @RequestBody SuscriptorRequest dto,
                                             HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.status(201).body(suscriptorService.crear(dto, comunidadId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERADOR')")
    @Operation(summary = "Actualizar suscriptor")
    public ResponseEntity<Suscriptor> actualizar(@PathVariable Long id,
                                                   @Valid @RequestBody SuscriptorRequest dto,
                                                   HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(suscriptorService.actualizar(id, dto, comunidadId));
    }
}
