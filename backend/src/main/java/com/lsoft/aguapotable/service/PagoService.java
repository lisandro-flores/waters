package com.lsoft.aguapotable.service;

import com.lsoft.aguapotable.domain.entity.Factura;
import com.lsoft.aguapotable.domain.entity.Pago;
import com.lsoft.aguapotable.domain.entity.Usuario;
import com.lsoft.aguapotable.domain.enums.EstadoFactura;
import com.lsoft.aguapotable.domain.enums.MetodoPago;
import com.lsoft.aguapotable.domain.repository.FacturaRepository;
import com.lsoft.aguapotable.domain.repository.PagoRepository;
import com.lsoft.aguapotable.exception.BusinessException;
import com.lsoft.aguapotable.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class PagoService {

    private final PagoRepository pagoRepository;
    private final FacturaRepository facturaRepository;

    @Transactional
    public Pago registrarPago(Long facturaId, BigDecimal monto,
                               MetodoPago metodoPago, String referencia,
                               Usuario cajero) {
        Factura factura = facturaRepository.findById(facturaId)
                .orElseThrow(() -> new ResourceNotFoundException("Factura", facturaId));

        if (factura.getEstado() == EstadoFactura.PAGADA || factura.getEstado() == EstadoFactura.ANULADA) {
            throw new BusinessException("La factura " + factura.getNumeroFactura() + " no admite más pagos");
        }

        if (monto.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException("El monto del pago debe ser mayor a cero");
        }

        Pago pago = Pago.builder()
                .factura(factura)
                .monto(monto)
                .fechaPago(LocalDate.now())
                .metodoPago(metodoPago)
                .referencia(referencia)
                .cajero(cajero)
                .build();

        pagoRepository.save(pago);
        actualizarEstadoFactura(factura);

        return pago;
    }

    private void actualizarEstadoFactura(Factura factura) {
        BigDecimal totalPagado = pagoRepository.sumPagadoByFactura(factura.getId());

        if (totalPagado.compareTo(factura.getTotalPagar()) >= 0) {
            factura.setEstado(EstadoFactura.PAGADA);
        } else if (totalPagado.compareTo(BigDecimal.ZERO) > 0) {
            factura.setEstado(EstadoFactura.PAGADA_PARCIAL);
        }

        facturaRepository.save(factura);
    }
}
