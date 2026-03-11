package com.lsoft.aguapotable.controller;

import com.lsoft.aguapotable.domain.entity.Usuario;
import com.lsoft.aguapotable.domain.repository.UsuarioRepository;
import com.lsoft.aguapotable.dto.request.LoginRequest;
import com.lsoft.aguapotable.dto.response.AuthResponse;
import com.lsoft.aguapotable.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Login y gestión de tokens JWT")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener token JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtUtil.generateToken(
                usuario.getEmail(),
                usuario.getComunidad().getId(),
                usuario.getRol().name());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .email(usuario.getEmail())
                .nombre(usuario.getNombreCompleto())
                .rol(usuario.getRol().name())
                .comunidadId(usuario.getComunidad().getId())
                .comunidadNombre(usuario.getComunidad().getNombre())
                .build());
    }
}
