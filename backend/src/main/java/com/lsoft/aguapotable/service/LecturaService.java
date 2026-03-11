package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Lectura;
import com.lsoft.aguapotable.domain.entity.Medidor;
import com.lsoft.aguapotable.domain.repository.LecturaRepository;
import com.lsoft.aguapotable.domain.repository.MedidorRepository;
import com.lsoft.aguapotable.dto.request.LecturaRequest;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LecturaService {

    private final LecturaRepository lecturaRepository;
    private final MedidorRepository medidorRepository;
    private final AlertaService alertaService;

    public List<Lectura> getPorMedidor(Long medidorId) {
        return lecturaRepository.findByMedidorIdOrderByAnioDescMesDesc(medidorId);
    }

    public List<Lectura> getPorPeriodo(Long comunidadId, Integer anio, Integer mes) {
        return lecturaRepository.findByComunidadAndPeriodo(comunidadId, anio, mes);
    }

    @Transactional
    public Lectura registrar(LecturaRequest request, Long comunidadId) {
        Medidor medidor = medidorRepository.findById(request.getMedidorId())
                .orElseThrow(() -> new ResourceNotFoundException("Medidor", request.getMedidorId()));

        // Validar que el medidor pertenece a la comunidad
        if (!medidor.getSuscriptor().getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Medidor", request.getMedidorId());
        }

        if (request.getLecturaActual() < request.getLecturaAnterior()) {
            throw new BusinessException("La lectura actual no puede ser menor que la anterior");
        }

        LocalDate fecha = request.getFechaLectura() != null ? request.getFechaLectura() : LocalDate.now();
        int anio = fecha.getYear();
        int mes = fecha.getMonthValue();

        // Validar que no exista lectura previa para el mismo período
        if (lecturaRepository.findByMedidorIdAndAnioAndMes(
                request.getMedidorId(), anio, mes).isPresent()) {
            throw new BusinessException("Ya existe una lectura para el medidor en " + anio + "/" + mes);
        }

        double consumo = request.getLecturaActual() - request.getLecturaAnterior();

        Lectura lectura = Lectura.builder()
                .medidor(medidor)
                .anio(anio)
                .mes(mes)
                .lecturaAnterior(request.getLecturaAnterior())
                .lecturaActual(request.getLecturaActual())
                .consumoM3(consumo)
                .fechaLectura(fecha)
                .observaciones(request.getObservaciones())
                .estimada(request.getEstimada() != null && request.getEstimada())
                .build();

        Lectura saved = lecturaRepository.save(lectura);

        // Detectar consumo anómalo
        try {
            alertaService.detectarConsumoAnomalo(saved);
        } catch (Exception e) {
            log.warn("Error al detectar consumo anómalo: {}", e.getMessage());
        }

        return saved;
    }
}
