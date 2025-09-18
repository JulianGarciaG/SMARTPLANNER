package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.Tarea;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    List<Tarea> findByUsuario_IdUsuario(Integer idUsuario);
}
