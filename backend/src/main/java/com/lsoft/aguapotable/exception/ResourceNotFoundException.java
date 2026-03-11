package com.lsoft.aguapotable.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String entidad, Long id) {
        super(entidad + " con id " + id + " no encontrado");
    }
    public ResourceNotFoundException(String mensaje) {
        super(mensaje);
    }
}
