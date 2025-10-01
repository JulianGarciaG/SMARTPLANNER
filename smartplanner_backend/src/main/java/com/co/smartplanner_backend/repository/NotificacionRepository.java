package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.Notificacion;
import com.co.smartplanner_backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Integer> {
    List<Notificacion> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
}
