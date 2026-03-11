package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Lectura;
import com.lsoft.aguapotable.dto.request.LecturaRequest;
import com.lsoft.aguapotable.service.LecturaService;
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
@RequestMapping("/api/v1/lecturas")
@RequiredArgsConstructor
@Tag(name = "Lecturas", description = "Registro de lecturas de medidores")
@SecurityRequirement(name = "bearerAuth")
public class LecturaController {

    private final LecturaService lecturaService;

    @GetMapping("/medidor/{medidorId}")
    @Operation(summary = "Historial de lecturas de un medidor")
    public ResponseEntity<List<Lectura>> getPorMedidor(@PathVariable Long medidorId) {
        return ResponseEntity.ok(lecturaService.getPorMedidor(medidorId));
    }

    @GetMapping("/periodo")
    @Operation(summary = "Lecturas de la comunidad en un período")
    public ResponseEntity<List<Lectura>> getPorPeriodo(
            @RequestParam Integer anio,
            @RequestParam Integer mes,
            HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.ok(lecturaService.getPorPeriodo(comunidadId, anio, mes));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERADOR')")
    @Operation(summary = "Registrar nueva lectura de medidor")
    public ResponseEntity<Lectura> registrar(@Valid @RequestBody LecturaRequest dto,
                                              HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        return ResponseEntity.status(201).body(lecturaService.registrar(dto, comunidadId));
    }
}
