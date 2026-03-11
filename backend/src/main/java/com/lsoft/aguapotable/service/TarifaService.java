package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Comunidad;
import com.lsoft.aguapotable.domain.entity.Tarifa;
import com.lsoft.aguapotable.domain.entity.TarifaRango;
import com.lsoft.aguapotable.domain.repository.ComunidadRepository;
import com.lsoft.aguapotable.domain.repository.TarifaRepository;
import com.lsoft.aguapotable.dto.request.TarifaRequest;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TarifaService {

    private final TarifaRepository tarifaRepository;
    private final ComunidadRepository comunidadRepository;

    public List<Tarifa> listarActivas(Long comunidadId) {
        return tarifaRepository.findByComunidadIdAndActivoTrue(comunidadId);
    }

    public Tarifa obtenerPorId(Long id, Long comunidadId) {
        Tarifa tarifa = tarifaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tarifa", id));
        if (!tarifa.getComunidad().getId().equals(comunidadId)) {
            throw new ResourceNotFoundException("Tarifa", id);
        }
        return tarifa;
    }

    @Transactional
    public Tarifa crear(TarifaRequest request, Long comunidadId) {
        Comunidad comunidad = comunidadRepository.findById(comunidadId)
                .orElseThrow(() -> new ResourceNotFoundException("Comunidad", comunidadId));

        Tarifa tarifa = Tarifa.builder()
                .nombre(request.getNombre())
                .comunidad(comunidad)
                .tipoSuscriptor(request.getTipoSuscriptor())
                .cuotaFija(request.getCuotaFija())
                .porcentajeMora(request.getPorcentajeMora())
                .diasGracia(request.getDiasGracia())
                .vigenciaDesde(request.getVigenciaDesde())
                .vigenciaHasta(request.getVigenciaHasta())
                .activo(true)
                .rangos(new ArrayList<>())
                .build();

        if (request.getRangos() != null) {
            for (TarifaRequest.RangoRequest rango : request.getRangos()) {
                TarifaRango tr = TarifaRango.builder()
                        .tarifa(tarifa)
                        .rangoDesde(rango.getRangoDesde())
                        .rangoHasta(rango.getRangoHasta())
                        .precioPorM3(rango.getPrecioPorM3())
                        .build();
                tarifa.getRangos().add(tr);
            }
        }

        return tarifaRepository.save(tarifa);
    }

    @Transactional
    public Tarifa actualizar(Long id, TarifaRequest request, Long comunidadId) {
        Tarifa tarifa = obtenerPorId(id, comunidadId);

        tarifa.setNombre(request.getNombre());
        tarifa.setTipoSuscriptor(request.getTipoSuscriptor());
        tarifa.setCuotaFija(request.getCuotaFija());
        tarifa.setPorcentajeMora(request.getPorcentajeMora());
        tarifa.setDiasGracia(request.getDiasGracia());
        tarifa.setVigenciaDesde(request.getVigenciaDesde());
        tarifa.setVigenciaHasta(request.getVigenciaHasta());

        // Reemplazar rangos (orphanRemoval se encarga de borrar los viejos)
        tarifa.getRangos().clear();
        if (request.getRangos() != null) {
            for (TarifaRequest.RangoRequest rango : request.getRangos()) {
                TarifaRango tr = TarifaRango.builder()
                        .tarifa(tarifa)
                        .rangoDesde(rango.getRangoDesde())
                        .rangoHasta(rango.getRangoHasta())
                        .precioPorM3(rango.getPrecioPorM3())
                        .build();
                tarifa.getRangos().add(tr);
            }
        }

        return tarifaRepository.save(tarifa);
    }

    @Transactional
    public void desactivar(Long id, Long comunidadId) {
        Tarifa tarifa = obtenerPorId(id, comunidadId);
        tarifa.setActivo(false);
        tarifaRepository.save(tarifa);
    }
}
