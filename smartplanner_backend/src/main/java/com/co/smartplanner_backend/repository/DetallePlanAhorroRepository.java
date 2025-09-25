package com.co.smartplanner_backend.repository;

import com.co.smartplanner_backend.model.DetallePlanAhorro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.math.BigDecimal;

@Repository
public interface DetallePlanAhorroRepository extends JpaRepository<DetallePlanAhorro, Integer> {
    
    // Buscar todos los aportes de un plan específico
    @Query("SELECT d FROM DetallePlanAhorro d WHERE d.planAhorro.idPlanAhorro = :idPlanAhorro ORDER BY d.fechaAporte DESC")
    List<DetallePlanAhorro> findByPlanAhorroIdOrderByFechaAporteDesc(@Param("idPlanAhorro") Integer idPlanAhorro);
    
    // Buscar aportes cumplidos de un plan
    @Query("SELECT d FROM DetallePlanAhorro d WHERE d.planAhorro.idPlanAhorro = :idPlanAhorro AND d.cumplido = true ORDER BY d.fechaAporte DESC")
    List<DetallePlanAhorro> findByPlanAhorroIdAndCumplidoTrueOrderByFechaAporteDesc(@Param("idPlanAhorro") Integer idPlanAhorro);
    
    // Obtener la suma total de aportes cumplidos de un plan
    @Query("SELECT COALESCE(SUM(d.montoAporte), 0) FROM DetallePlanAhorro d WHERE d.planAhorro.idPlanAhorro = :idPlanAhorro AND d.cumplido = true")
    BigDecimal sumMontoAporteByCumplidoAndPlanAhorroId(@Param("idPlanAhorro") Integer idPlanAhorro);
    
    // Contar aportes de un plan
    @Query("SELECT COUNT(d) FROM DetallePlanAhorro d WHERE d.planAhorro.idPlanAhorro = :idPlanAhorro")
    Long countByPlanAhorroId(@Param("idPlanAhorro") Integer idPlanAhorro);
    
    @Query("SELECT COALESCE(SUM(d.montoAporte), 0) FROM DetallePlanAhorro d WHERE d.planAhorro.idPlanAhorro = :idPlanAhorro")
    BigDecimal sumAllMontoAportePorPlan(@Param("idPlanAhorro") Integer idPlanAhorro);
    
    // Buscar aportes por rango de fechas
    @Query("SELECT d FROM DetallePlanAhorro d WHERE d.planAhorro.idPlanAhorro = :idPlanAhorro AND d.fechaAporte BETWEEN :fechaInicio AND :fechaFin ORDER BY d.fechaAporte DESC")
    List<DetallePlanAhorro> findByPlanAhorroIdAndFechaAporteBetweenOrderByFechaAporteDesc(
            @Param("idPlanAhorro") Integer idPlanAhorro, 
            @Param("fechaInicio") java.time.LocalDate fechaInicio, 
            @Param("fechaFin") java.time.LocalDate fechaFin);
    
    // Eliminar todos los aportes de un plan (útil para cuando se elimina el plan)
    void deleteByPlanAhorroIdPlanAhorro(Integer idPlanAhorro);
}