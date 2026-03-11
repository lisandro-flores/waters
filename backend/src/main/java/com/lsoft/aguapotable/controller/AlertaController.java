package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Alerta;
import com.lsoft.aguapotable.domain.entity.Usuario;
import com.lsoft.aguapotable.domain.enums.EstadoAlerta;
import com.lsoft.aguapotable.domain.repository.AlertaRepository;
import com.lsoft.aguapotable.domain.repository.UsuarioRepository;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import com.lsoft.aguapotable.service.AlertaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/alertas")
@RequiredArgsConstructor
@Tag(name = "Alertas", description = "Gestión de alertas operativas")
@SecurityRequirement(name = "bearerAuth")
public class AlertaController {

    private final AlertaService alertaService;
    private final AlertaRepository alertaRepository;
    private final UsuarioRepository usuarioRepository;

    @GetMapping
    @Operation(summary = "Listar alertas de la comunidad (filtro por estado)")
    public ResponseEntity<List<Alerta>> listar(
            @RequestParam(required = false) EstadoAlerta estado,
            HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        if (estado != null) {
            return ResponseEntity.ok(alertaRepository.findByComunidadIdAndEstado(comunidadId, estado));
        }
        return ResponseEntity.ok(alertaService.getAlertasPendientes(comunidadId));
    }

    @PatchMapping("/{id}/resolver")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','OPERADOR')")
    @Operation(summary = "Marcar alerta como resuelta")
    public ResponseEntity<Alerta> resolver(@PathVariable Long id,
                                            HttpServletRequest request,
                                            Authentication authentication) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", id));
        if (!alerta.getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Alerta", id);
        }

        Usuario usuario = usuarioRepository.findByEmail(authentication.getName()).orElse(null);
        alerta.setEstado(EstadoAlerta.RESUELTA);
        alerta.setFechaResuelta(LocalDateTime.now());
        alerta.setResueltaPor(usuario);

        return ResponseEntity.ok(alertaRepository.save(alerta));
    }

    @PatchMapping("/{id}/descartar")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN')")
    @Operation(summary = "Descartar una alerta")
    public ResponseEntity<Alerta> descartar(@PathVariable Long id,
                                             HttpServletRequest request) {
        Long comunidadId = (Long) request.getAttribute("comunidadId");
        Alerta alerta = alertaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", id));
        if (!alerta.getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Alerta", id);
        }
        alerta.setEstado(EstadoAlerta.DESCARTADA);
        return ResponseEntity.ok(alertaRepository.save(alerta));
    }
}
