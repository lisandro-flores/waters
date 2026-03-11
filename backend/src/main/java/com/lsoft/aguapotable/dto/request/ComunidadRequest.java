package com.lsoft.aguapotable.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ComunidadRequest {

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100)
    private String nombre;

    @Size(max = 200)
    private String direccion;

    @Size(max = 20)
    private String telefono;

    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String ruc;

    @Size(max = 80)
    private String provincia;

    @Size(max = 80)
    private String municipio;
}
