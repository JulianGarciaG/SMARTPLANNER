package com.co.smartplanner_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PlanAhorroDto {
    private Integer idPlanAhorro;
    private String nombrePlan;
    private BigDecimal montoActual;
    private BigDecimal montoMeta;
    private LocalDate fechaFin;
    private Integer idUsuario;

    // Getters y Setters
    public Integer getIdPlanAhorro() {
        return idPlanAhorro;
    }

    public void setIdPlanAhorro(Integer idPlanAhorro) {
        this.idPlanAhorro = idPlanAhorro;
    }

    public String getNombrePlan() {
        return nombrePlan;
    }

    public void setNombrePlan(String nombrePlan) {
        this.nombrePlan = nombrePlan;
    }

    public BigDecimal getMontoActual() {
        return montoActual;
    }

    public void setMontoActual(BigDecimal montoActual) {
        this.montoActual = montoActual;
    }

    public BigDecimal getMontoMeta() {
        return montoMeta;
    }

    public void setMontoMeta(BigDecimal montoMeta) {
        this.montoMeta = montoMeta;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }
}

