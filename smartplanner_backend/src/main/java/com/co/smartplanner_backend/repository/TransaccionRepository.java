package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.Transaccion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransaccionRepository extends JpaRepository<Transaccion, Long> {
}
