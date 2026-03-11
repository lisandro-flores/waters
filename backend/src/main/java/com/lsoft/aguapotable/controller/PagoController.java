package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Pago;
import com.lsoft.aguapotable.domain.entity.Usuario;
import com.lsoft.aguapotable.domain.repository.PagoRepository;
import com.lsoft.aguapotable.domain.repository.UsuarioRepository;
import com.lsoft.aguapotable.dto.request.PagoRequest;
import com.lsoft.aguapotable.service.PagoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pagos")
@RequiredArgsConstructor
@Tag(name = "Pagos", description = "Registro y consulta de pagos")
@SecurityRequirement(name = "bearerAuth")
public class PagoController {

    private final PagoService pagoService;
    private final PagoRepository pagoRepository;
    private final UsuarioRepository usuarioRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMIN','CAJERO')")
    @Operation(summary = "Registrar un pago sobre una factura")
    public ResponseEntity<Pago> registrar(@Valid @RequestBody PagoRequest dto,
                                           Authentication authentication) {
        Usuario cajero = usuarioRepository.findByEmail(authentication.getName())
                .orElse(null);

        Pago pago = pagoService.registrarPago(
                dto.getFacturaId(),
                dto.getMonto(),
                dto.getMetodoPago(),
                dto.getReferencia(),
                cajero
        );
        return ResponseEntity.status(201).body(pago);
    }

    @GetMapping("/factura/{facturaId}")
    @Operation(summary = "Listar pagos de una factura")
    public ResponseEntity<List<Pago>> getPorFactura(@PathVariable Long facturaId) {
        return ResponseEntity.ok(pagoRepository.findByFacturaId(facturaId));
    }
}
