package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.PlanAhorro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanAhorroRepository extends JpaRepository<PlanAhorro, Integer> {
    
    // Buscar planes de ahorro activos (donde el monto actual < monto meta)
    @Query("SELECT p FROM PlanAhorro p WHERE p.usuario.id = :idUsuario AND p.montoActual < p.montoMeta")
    List<PlanAhorro> findActiveByUsuarioId(@Param("idUsuario") Integer idUsuario);
    
    // Buscar planes de ahorro completados (donde el monto actual >= monto meta)
    @Query("SELECT p FROM PlanAhorro p WHERE p.usuario.id = :idUsuario AND p.montoActual >= p.montoMeta")
    List<PlanAhorro> findCompletedByUsuarioId(@Param("idUsuario") Integer idUsuario);

    @Query("SELECT p FROM PlanAhorro p WHERE p.usuario.idUsuario = :idUsuario AND p.eliminado = false")
    List<PlanAhorro> findByUsuarioId(@Param("idUsuario") Integer idUsuario);

}