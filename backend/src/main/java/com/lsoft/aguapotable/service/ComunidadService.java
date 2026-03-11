package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Comunidad;
import com.lsoft.aguapotable.domain.repository.ComunidadRepository;
import com.lsoft.aguapotable.dto.request.ComunidadRequest;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComunidadService {

    private final ComunidadRepository comunidadRepository;

    public List<Comunidad> listarActivas() {
        return comunidadRepository.findByActivoTrue();
    }

    public Comunidad obtenerPorId(Long id) {
        return comunidadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comunidad", id));
    }

    @Transactional
    public Comunidad crear(ComunidadRequest request) {
        if (comunidadRepository.existsByNombre(request.getNombre())) {
            throw new BusinessException("Ya existe una comunidad con el nombre: " + request.getNombre());
        }
        Comunidad comunidad = Comunidad.builder()
                .nombre(request.getNombre())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .ruc(request.getRuc())
                .provincia(request.getProvincia())
                .municipio(request.getMunicipio())
                .activo(true)
                .build();
        return comunidadRepository.save(comunidad);
    }

    @Transactional
    public Comunidad actualizar(Long id, ComunidadRequest request) {
        Comunidad comunidad = obtenerPorId(id);
        comunidad.setNombre(request.getNombre());
        comunidad.setDireccion(request.getDireccion());
        comunidad.setTelefono(request.getTelefono());
        comunidad.setEmail(request.getEmail());
        comunidad.setRuc(request.getRuc());
        comunidad.setProvincia(request.getProvincia());
        comunidad.setMunicipio(request.getMunicipio());
        return comunidadRepository.save(comunidad);
    }

    @Transactional
    public void desactivar(Long id) {
        Comunidad comunidad = obtenerPorId(id);
        comunidad.setActivo(false);
        comunidadRepository.save(comunidad);
    }
}
