package com.lsoft.aguapotable.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private String nombre;
    private String rol;
    private Long comunidadId;
    private String comunidadNombre;
}
