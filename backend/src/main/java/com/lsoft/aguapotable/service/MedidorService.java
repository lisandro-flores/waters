package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Medidor;
import com.lsoft.aguapotable.domain.entity.Suscriptor;
import com.lsoft.aguapotable.domain.enums.EstadoMedidor;
import com.lsoft.aguapotable.domain.repository.MedidorRepository;
import com.lsoft.aguapotable.domain.repository.SuscriptorRepository;
import com.lsoft.aguapotable.dto.request.MedidorRequest;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedidorService {

    private final MedidorRepository medidorRepository;
    private final SuscriptorRepository suscriptorRepository;

    public List<Medidor> getPorSuscriptor(Long suscriptorId) {
        return medidorRepository.findBySuscriptorId(suscriptorId);
    }

    public List<Medidor> getPorComunidadYEstado(Long comunidadId, EstadoMedidor estado) {
        return medidorRepository.findBySuscriptorComunidadIdAndEstado(comunidadId, estado);
    }

    public Medidor obtenerPorId(Long id, Long comunidadId) {
        Medidor medidor = medidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medidor", id));
        if (!medidor.getSuscriptor().getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Medidor", id);
        }
        return medidor;
    }

    @Transactional
    public Medidor crear(MedidorRequest request, Long comunidadId) {
        Suscriptor suscriptor = suscriptorRepository.findById(request.getSuscriptorId())
                .orElseThrow(() -> new ResourceNotFoundException("Suscriptor", request.getSuscriptorId()));

        if (!suscriptor.getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Suscriptor", request.getSuscriptorId());
        }

        if (medidorRepository.existsByNumeroSerie(request.getNumeroSerie())) {
            throw new BusinessException("Ya existe un medidor con serie: " + request.getNumeroSerie());
        }

        Medidor medidor = Medidor.builder()
                .numeroSerie(request.getNumeroSerie())
                .marca(request.getMarca())
                .diametro(request.getDiametro())
                .lecturaInicial(request.getLecturaInicial() != null ? request.getLecturaInicial() : 0.0)
                .estado(request.getEstado() != null ? request.getEstado() : EstadoMedidor.ACTIVO)
                .fechaInstalacion(request.getFechaInstalacion() != null ? request.getFechaInstalacion() : LocalDate.now())
                .suscriptor(suscriptor)
                .build();

        return medidorRepository.save(medidor);
    }

    @Transactional
    public Medidor actualizar(Long id, MedidorRequest request, Long comunidadId) {
        Medidor medidor = obtenerPorId(id, comunidadId);

        medidor.setNumeroSerie(request.getNumeroSerie());
        medidor.setMarca(request.getMarca());
        medidor.setDiametro(request.getDiametro());
        medidor.setEstado(request.getEstado());

        if (request.getSuscriptorId() != null &&
                !request.getSuscriptorId().equals(medidor.getSuscriptor().getId())) {
            Suscriptor nuevoSuscriptor = suscriptorRepository.findById(request.getSuscriptorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Suscriptor", request.getSuscriptorId()));
            medidor.setSuscriptor(nuevoSuscriptor);
        }

        return medidorRepository.save(medidor);
    }

    @Transactional
    public Medidor darDeBaja(Long id, Long comunidadId) {
        Medidor medidor = obtenerPorId(id, comunidadId);
        medidor.setEstado(EstadoMedidor.RETIRADO);
        medidor.setFechaBaja(LocalDate.now());
        return medidorRepository.save(medidor);
    }
}
