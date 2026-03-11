package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.*;
import com.lsoft.aguapotable.domain.enums.EstadoFactura;
import com.lsoft.aguapotable.domain.repository.*;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Lógica de negocio para generación de facturas.
 * Aplica tarifa escalonada y cargo fijo a cada lectura.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FacturacionService {

    private final FacturaRepository facturaRepository;
    private final LecturaRepository lecturaRepository;
    private final TarifaRepository tarifaRepository;
    private final SuscriptorRepository suscriptorRepository;

    /**
     * Genera la factura para una lectura específica usando la tarifa vigente.
     */
    @Transactional
    public Factura generarFactura(Long lecturaId, Long comunidadId) {
        Lectura lectura = lecturaRepository.findById(lecturaId)
                .orElseThrow(() -> new ResourceNotFoundException("Lectura", lecturaId));

        Suscriptor suscriptor = lectura.getMedidor().getSuscriptor();

        // Verificar que no exista ya factura para esta lectura
        if (facturaRepository.findByNumeroFacturaAndSuscriptorComunidadId(
                buildNumeroFactura(suscriptor, lectura.getAnio(), lectura.getMes()), comunidadId).isPresent()) {
            throw new BusinessException("Ya existe una factura para este período");
        }

        Tarifa tarifa = tarifaRepository
                .findActivaByComunidadAndTipo(comunidadId, suscriptor.getTipo(), LocalDate.now())
                .orElseThrow(() -> new BusinessException("No hay tarifa vigente para el tipo: " + suscriptor.getTipo()));

        BigDecimal montoConsumo = calcularMontoConsumo(lectura.getConsumoM3(), tarifa);

        LocalDate fechaEmision = LocalDate.now();
        LocalDate fechaVencimiento = fechaEmision.plusDays(tarifa.getDiasGracia());

        Factura factura = Factura.builder()
                .numeroFactura(buildNumeroFactura(suscriptor, lectura.getAnio(), lectura.getMes()))
                .suscriptor(suscriptor)
                .lectura(lectura)
                .tarifa(tarifa)
                .anio(lectura.getAnio())
                .mes(lectura.getMes())
                .consumoM3(lectura.getConsumoM3())
                .montoBase(tarifa.getCuotaFija())
                .montoConsumo(montoConsumo)
                .totalPagar(tarifa.getCuotaFija().add(montoConsumo))
                .fechaEmision(fechaEmision)
                .fechaVencimiento(fechaVencimiento)
                .estado(EstadoFactura.PENDIENTE)
                .build();

        return facturaRepository.save(factura);
    }

    /**
     * Calcula el monto de consumo aplicando tarifa escalonada.
     */
    public BigDecimal calcularMontoConsumo(Double consumoM3, Tarifa tarifa) {
        BigDecimal total = BigDecimal.ZERO;
        double restante = consumoM3;

        List<TarifaRango> rangos = tarifa.getRangos();

        for (TarifaRango rango : rangos) {
            if (restante <= 0) break;

            double inicioRango = rango.getRangoDesde();
            double finRango = rango.getRangoHasta() != null ? rango.getRangoHasta() : Double.MAX_VALUE;
            double limiteRango = finRango - inicioRango;

            double consumoEnRango = Math.min(restante, limiteRango);
            total = total.add(
                BigDecimal.valueOf(consumoEnRango)
                    .multiply(rango.getPrecioPorM3())
                    .setScale(2, RoundingMode.HALF_UP)
            );
            restante -= consumoEnRango;
        }

        return total;
    }

    /** Genera facturas masivas para todos los suscriptores de un período */
    @Transactional
    public int generarFacturasMasivas(Long comunidadId, int anio, int mes) {
        List<Lectura> lecturas = lecturaRepository.findByComunidadAndPeriodo(comunidadId, anio, mes);
        int generadas = 0;
        for (Lectura lectura : lecturas) {
            try {
                generarFactura(lectura.getId(), comunidadId);
                generadas++;
            } catch (BusinessException e) {
                log.warn("Factura ya existente para lectura {}: {}", lectura.getId(), e.getMessage());
            }
        }
        return generadas;
    }

    private String buildNumeroFactura(Suscriptor suscriptor, int anio, int mes) {
        return String.format("%s-%d%02d", suscriptor.getNumeroCuenta(), anio, mes);
    }
}
