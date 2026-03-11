package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Alerta;
import com.lsoft.aguapotable.domain.enums.EstadoAlerta;
import com.lsoft.aguapotable.domain.enums.TipoAlerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {
    List<Alerta> findByComunidadIdAndEstado(Long comunidadId, EstadoAlerta estado);
    List<Alerta> findByComunidadIdAndTipo(Long comunidadId, TipoAlerta tipo);
    long countByComunidadIdAndEstado(Long comunidadId, EstadoAlerta estado);
}
