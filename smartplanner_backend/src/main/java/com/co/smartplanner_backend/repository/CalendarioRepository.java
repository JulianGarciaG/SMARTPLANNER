package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.Calendario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CalendarioRepository extends JpaRepository<Calendario, Integer> {
}
