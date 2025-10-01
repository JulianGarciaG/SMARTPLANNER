package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventoRepository extends JpaRepository<Evento, Integer> {
    List<Evento> findByCalendarioIdCalendario(Integer idCalendario);

    long countByCalendarioIdCalendario(Integer idCalendario);
}
