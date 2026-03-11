package com.lsoft.aguapotable.domain.repository;

import com.lsoft.aguapotable.domain.entity.Usuario;
import com.lsoft.aguapotable.domain.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmailAndComunidadId(String email, Long comunidadId);
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByComunidadIdAndActivoTrue(Long comunidadId);
    List<Usuario> findByComunidadIdAndRol(Long comunidadId, RolUsuario rol);
    boolean existsByEmailAndComunidadId(String email, Long comunidadId);
}
