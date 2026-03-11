package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Medidor;
import com.lsoft.aguapotable.domain.enums.EstadoMedidor;
import com.lsoft.aguapotable.dto.request.MedidorRequest;
import com.lsoft.aguapotable.service.MedidorService;
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
@RequestMapping("/api/v1/medidores")
@RequiredArgsConstructor
@Tag(name = "Medidores", description = "Gestión de medidores de agua")
@SecurityRequirement(name = "bearerAuth")
public class MedidorController {

    private final MedidorService medidorService;

    @GetMapping("/suscriptor/{suscriptorId}")
    @Operation(summary = "Listar medidores de un suscriptor")
    public ResponseEntity<List<Medidor>> getPorSuscriptor(@PathVariable Long suscriptorId) {
        return ResponseEntity.ok(medidorService.getPorSuscriptor(suscriptorId));
    }

    @GetMapping
    @Operation(summary = "Listar medidores de la comunidad por estado")
    public ResponseEntity<List<Medidor>> listar(
            @RequestParam(required = false, defaultValue = "ACTIVO") EstadoMedidor estado,
            HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(medidorService.getPorComunidadYEstado(comunidadId, estado));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener medidor por ID")
    public ResponseEntity<Medidor> getById(@PathVariable Long id, HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(medidorService.obtenerPorId(id, comunidadId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERADOR')")
    @Operation(summary = "Registrar nuevo medidor")
    public ResponseEntity<Medidor> crear(@Valid @RequestBody MedidorRequest dto,
                                          HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.status(201).body(medidorService.crear(dto, comunidadId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERADOR')")
    @Operation(summary = "Actualizar medidor")
    public ResponseEntity<Medidor> actualizar(@PathVariable Long id,
                                               @Valid @RequestBody MedidorRequest dto,
                                               HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(medidorService.actualizar(id, dto, comunidadId));
    }

    @PatchMapping("/{id}/baja")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Dar de baja un medidor")
    public ResponseEntity<Medidor> darDeBaja(@PathVariable Long id, HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(medidorService.darDeBaja(id, comunidadId));
    }
}
