package com.lsoft.aguapotable.dto.request;

import com.lsoft.aguapotable.domain.enums.EstadoSuscriptor;
import com.lsoft.aguapotable.domain.enums.TipoSuscriptor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SuscriptorRequest {

    @NotBlank(message = "El número de cuenta es requerido")
    @Size(max = 20)
    private String numeroCuenta;

    @NotBlank(message = "El nombre es requerido")
    @Size(max = 100)
    private String nombre;

    @NotBlank(message = "El apellido es requerido")
    @Size(max = 100)
    private String apellido;

    @Size(max = 20)
    private String identificacion;

    @Size(max = 200)
    private String direccion;

    @Size(max = 20)
    private String telefono;

    @Size(max = 150)
    private String email;

    private TipoSuscriptor tipo = TipoSuscriptor.DOMICILIAR;
    private EstadoSuscriptor estado = EstadoSuscriptor.ACTIVO;
}
