package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Alerta;
import com.lsoft.aguapotable.domain.entity.Comunidad;
import com.lsoft.aguapotable.domain.entity.Lectura;
import com.lsoft.aguapotable.domain.entity.Medidor;
import com.lsoft.aguapotable.domain.enums.EstadoAlerta;
import com.lsoft.aguapotable.domain.enums.TipoAlerta;
import com.lsoft.aguapotable.domain.repository.AlertaRepository;
import com.lsoft.aguapotable.domain.repository.ComunidadRepository;
import com.lsoft.aguapotable.domain.repository.LecturaRepository;
import com.lsoft.aguapotable.domain.repository.MedidorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * Servicio de alertas automáticas.
 * Se ejecuta mediante tareas programadas (scheduler).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AlertaService {

    private final AlertaRepository alertaRepository;
    private final ComunidadRepository comunidadRepository;
    private final LecturaRepository lecturaRepository;
    private final MedidorRepository medidorRepository;

    /**
     * Detecta medidores sin lectura al cierre de cada mes.
     * Corre cada día 1 del mes a las 08:00.
     */
    @Scheduled(cron = "0 0 8 1 * *")
    @Transactional
    public void detectarMedidoresSinLectura() {
        LocalDate ayer = LocalDate.now().minusDays(1);
        int mesAnterior = ayer.getMonthValue();
        int anio = ayer.getYear();

        List<Comunidad> comunidades = comunidadRepository.findByActivoTrue();
        for (Comunidad comunidad : comunidades) {
            List<Long> sinLectura = lecturaRepository
                    .medidoresSinLectura(comunidad.getId(), anio, mesAnterior);

            for (Long medidorId : sinLectura) {
                medidorRepository.findById(medidorId).ifPresent(medidor ->
                        crearAlerta(comunidad, medidor, TipoAlerta.MEDIDOR_SIN_LECTURA,
                                "Medidor " + medidor.getNumeroSerie() + " sin lectura en " +
                                anio + "/" + String.format("%02d", mesAnterior)));
            }
        }
        log.info("Verificación de lecturas completada - {}/{}", anio, mesAnterior);
    }

    /**
     * Detecta consumo anómalo comparando con promedio de últimos 3 meses.
     * Umbral: ±50% del promedio histórico.
     */
    @Transactional
    public void detectarConsumoAnomalo(Lectura nuevaLectura) {
        // TODO: implementar lógica de comparación histórica
    }

    public Alerta crearAlerta(Comunidad comunidad, Medidor medidor,
                               TipoAlerta tipo, String mensaje) {
        Alerta alerta = Alerta.builder()
                .comunidad(comunidad)
                .suscriptor(medidor != null ? medidor.getSuscriptor() : null)
                .tipo(tipo)
                .mensaje(mensaje)
                .estado(EstadoAlerta.PENDIENTE)
                .build();
        return alertaRepository.save(alerta);
    }

    public List<Alerta> getAlertasPendientes(Long comunidadId) {
        return alertaRepository.findByComunidadIdAndEstado(comunidadId, EstadoAlerta.PENDIENTE);
    }
}
