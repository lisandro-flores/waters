package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Comunidad;
import com.lsoft.aguapotable.domain.entity.Suscriptor;
import com.lsoft.aguapotable.domain.enums.EstadoSuscriptor;
import com.lsoft.aguapotable.domain.repository.ComunidadRepository;
import com.lsoft.aguapotable.domain.repository.SuscriptorRepository;
import com.lsoft.aguapotable.dto.request.SuscriptorRequest;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class SuscriptorService {

    private final SuscriptorRepository suscriptorRepository;
    private final ComunidadRepository comunidadRepository;

    public Page<Suscriptor> listar(Long comunidadId, String query, Pageable pageable) {
        if (query != null && !query.isBlank()) {
            return suscriptorRepository.buscar(comunidadId, query, pageable);
        }
        return suscriptorRepository.findByComunidadId(comunidadId, pageable);
    }

    public Suscriptor obtenerPorId(Long id, Long comunidadId) {
        Suscriptor suscriptor = suscriptorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Suscriptor", id));
        validarComunidad(suscriptor, comunidadId);
        return suscriptor;
    }

    @Transactional
    public Suscriptor crear(SuscriptorRequest request, Long comunidadId) {
        Comunidad comunidad = comunidadRepository.findById(comunidadId)
                .orElseThrow(() -> new ResourceNotFoundException("Comunidad", comunidadId));

        if (suscriptorRepository.findByNumeroCuentaAndComunidadId(
                request.getNumeroCuenta(), comunidadId).isPresent()) {
            throw new BusinessException("Ya existe un suscriptor con la cuenta: " + request.getNumeroCuenta());
        }

        Suscriptor suscriptor = Suscriptor.builder()
                .numeroCuenta(request.getNumeroCuenta())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .identificacion(request.getIdentificacion())
                .direccion(request.getDireccion())
                .telefono(request.getTelefono())
                .email(request.getEmail())
                .tipo(request.getTipo())
                .estado(request.getEstado())
                .fechaIngreso(LocalDate.now())
                .comunidad(comunidad)
                .build();

        return suscriptorRepository.save(suscriptor);
    }

    @Transactional
    public Suscriptor actualizar(Long id, SuscriptorRequest request, Long comunidadId) {
        Suscriptor suscriptor = obtenerPorId(id, comunidadId);

        suscriptor.setNombre(request.getNombre());
        suscriptor.setApellido(request.getApellido());
        suscriptor.setIdentificacion(request.getIdentificacion());
        suscriptor.setDireccion(request.getDireccion());
        suscriptor.setTelefono(request.getTelefono());
        suscriptor.setEmail(request.getEmail());
        suscriptor.setTipo(request.getTipo());
        suscriptor.setEstado(request.getEstado());

        return suscriptorRepository.save(suscriptor);
    }

    public long contarActivos(Long comunidadId) {
        return suscriptorRepository.countByComunidadIdAndEstado(comunidadId, EstadoSuscriptor.ACTIVO);
    }

    private void validarComunidad(Suscriptor suscriptor, Long comunidadId) {
        if (!suscriptor.getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Suscriptor", suscriptor.getId());
        }
    }
}
