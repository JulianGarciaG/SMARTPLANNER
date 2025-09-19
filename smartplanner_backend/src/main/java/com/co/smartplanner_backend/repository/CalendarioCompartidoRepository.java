package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.CalendarioCompartido;
import com.co.smartplanner_backend.model.CalendarioCompartidoId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarioCompartidoRepository extends JpaRepository<CalendarioCompartido, CalendarioCompartidoId> {

    // Buscar todos los calendarios compartidos de un usuario (usando el campo dentro del id compuesto)
    List<CalendarioCompartido> findByIdIdUsuario(Integer idUsuario);
}
